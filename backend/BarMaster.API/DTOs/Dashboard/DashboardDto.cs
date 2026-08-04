namespace BarMaster.API.DTOs.Dashboard;

public class DashboardDto
{
    public decimal TodaySales { get; set; }

    public decimal TodayProfit { get; set; }

    public decimal TodayPurchases { get; set; }

    public decimal TodayExpenses { get; set; }

    public decimal InventoryValue { get; set; }

    public int LowStockItems { get; set; }

    public int OutOfStockItems { get; set; }

    public int TotalDrinks { get; set; }

    public int TotalSuppliers { get; set; }

    public int TotalWorkers { get; set; }

    public string BestSellingDrink { get; set; } = string.Empty;

    public string BestSalesLocation { get; set; } = string.Empty;
}