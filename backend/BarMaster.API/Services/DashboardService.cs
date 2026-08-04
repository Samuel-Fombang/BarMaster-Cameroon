using BarMaster.API.DTOs.Dashboard;
using BarMaster.API.Repositories;

namespace BarMaster.API.Services;

public class DashboardService
{
    private readonly SaleRepository _saleRepository;
    private readonly PurchaseRepository _purchaseRepository;
    private readonly ExpenseRepository _expenseRepository;
    private readonly InventoryRepository _inventoryRepository;
    private readonly DrinkRepository _drinkRepository;
    private readonly SupplierRepository _supplierRepository;
    private readonly WorkerRepository _workerRepository;
    private readonly LocationRepository _locationRepository;

    public DashboardService(
        SaleRepository saleRepository,
        PurchaseRepository purchaseRepository,
        ExpenseRepository expenseRepository,
        InventoryRepository inventoryRepository,
        DrinkRepository drinkRepository,
        SupplierRepository supplierRepository,
        WorkerRepository workerRepository,
        LocationRepository locationRepository
    )
    {
        _saleRepository = saleRepository;
        _purchaseRepository = purchaseRepository;
        _expenseRepository = expenseRepository;
        _inventoryRepository = inventoryRepository;
        _drinkRepository = drinkRepository;
        _supplierRepository = supplierRepository;
        _workerRepository = workerRepository;
        _locationRepository = locationRepository;
    }

    public async Task<DashboardDto> GetDashboardAsync()
    {
        var salesTask =
            _saleRepository.GetAllAsync();

        var purchasesTask =
            _purchaseRepository.GetAllAsync();

        var expensesTask =
            _expenseRepository.GetAllAsync();

        var inventoryTask =
            _inventoryRepository.GetAllAsync();

        var drinksTask =
            _drinkRepository.GetAllAsync();

        var suppliersTask =
            _supplierRepository.GetAllAsync();

        var workersTask =
            _workerRepository.GetAllAsync();

        var locationsTask =
            _locationRepository.GetAllAsync();

        await Task.WhenAll(
            salesTask,
            purchasesTask,
            expensesTask,
            inventoryTask,
            drinksTask,
            suppliersTask,
            workersTask,
            locationsTask
        );

        var sales = await salesTask;
        var purchases = await purchasesTask;
        var expenses = await expensesTask;
        var inventory = await inventoryTask;
        var drinks = await drinksTask;
        var suppliers = await suppliersTask;
        var workers = await workersTask;
        var locations = await locationsTask;

        var todayStart = DateTime.UtcNow.Date;
        var tomorrowStart = todayStart.AddDays(1);

        var todaySalesRecords = sales
            .Where(sale =>
                sale.SaleDate >= todayStart &&
                sale.SaleDate < tomorrowStart &&
                sale.Status == "Completed"
            )
            .ToList();

        var todayPurchaseRecords = purchases
            .Where(purchase =>
                purchase.PurchaseDate >= todayStart &&
                purchase.PurchaseDate < tomorrowStart &&
                purchase.Status == "Completed"
            )
            .ToList();

        var todayExpenseRecords = expenses
            .Where(expense =>
                expense.ExpenseDate >= todayStart &&
                expense.ExpenseDate < tomorrowStart
            )
            .ToList();

        var todaySales = todaySalesRecords.Sum(
            sale => sale.TotalAmount
        );

        var todayProfit = todaySalesRecords.Sum(
            sale => sale.Profit
        );

        var todayPurchases = todayPurchaseRecords.Sum(
            purchase => purchase.TotalAmount
        );

        var todayExpenses = todayExpenseRecords.Sum(
            expense => expense.Amount
        );

        var drinkLookup = drinks
            .Where(drink =>
                !string.IsNullOrWhiteSpace(drink.Id)
            )
            .ToDictionary(
                drink => drink.Id!,
                drink => drink
            );

        var locationLookup = locations
            .Where(location =>
                !string.IsNullOrWhiteSpace(location.Id)
            )
            .ToDictionary(
                location => location.Id!,
                location => location
            );

        var inventoryValue = inventory.Sum(item =>
        {
            if (
                !drinkLookup.TryGetValue(
                    item.DrinkId,
                    out var drink
                )
            )
            {
                return 0m;
            }

            return item.Quantity * drink.BuyingPrice;
        });

        var lowStockItems = inventory.Count(item =>
            item.IsActive &&
            item.Quantity > 0 &&
            item.Quantity <= item.MinimumQuantity
        );

        var outOfStockItems = inventory.Count(item =>
            item.IsActive &&
            item.Quantity == 0
        );

        var bestSellingDrink = sales
            .Where(sale =>
                sale.Status == "Completed"
            )
            .GroupBy(sale => sale.DrinkId)
            .Select(group => new
            {
                DrinkId = group.Key,
                QuantitySold = group.Sum(
                    sale => sale.Quantity
                )
            })
            .OrderByDescending(item =>
                item.QuantitySold
            )
            .Select(item =>
            {
                if (
                    drinkLookup.TryGetValue(
                        item.DrinkId,
                        out var drink
                    )
                )
                {
                    return BuildDrinkDisplayName(
                        drink.Name,
                        drink.BottleSize
                    );
                }

                return "Unknown drink";
            })
            .FirstOrDefault() ?? "—";

        var bestSalesLocation = sales
            .Where(sale =>
                sale.Status == "Completed"
            )
            .GroupBy(sale => sale.LocationId)
            .Select(group => new
            {
                LocationId = group.Key,
                Revenue = group.Sum(
                    sale => sale.TotalAmount
                )
            })
            .OrderByDescending(item =>
                item.Revenue
            )
            .Select(item =>
            {
                if (
                    locationLookup.TryGetValue(
                        item.LocationId,
                        out var location
                    )
                )
                {
                    return location.Name;
                }

                return "Unknown location";
            })
            .FirstOrDefault() ?? "—";

        return new DashboardDto
        {
            TodaySales = todaySales,
            TodayProfit = todayProfit,
            TodayPurchases = todayPurchases,
            TodayExpenses = todayExpenses,
            InventoryValue = inventoryValue,
            LowStockItems = lowStockItems,
            OutOfStockItems = outOfStockItems,
            TotalDrinks = drinks.Count,
            TotalSuppliers = suppliers.Count,
            TotalWorkers = workers.Count,
            BestSellingDrink = bestSellingDrink,
            BestSalesLocation = bestSalesLocation
        };
    }

    private static string BuildDrinkDisplayName(
        string name,
        string bottleSize
    )
    {
        if (string.IsNullOrWhiteSpace(bottleSize))
        {
            return name;
        }

        return $"{name} {bottleSize}";
    }
}