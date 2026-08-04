using BarMaster.API.DTOs;
using BarMaster.API.Models;
using BarMaster.API.Repositories;

namespace BarMaster.API.Services;

public class SaleService
{
    private readonly SaleRepository _saleRepository;
    private readonly InventoryService _inventoryService;
    private readonly DrinkRepository _drinkRepository;
    private readonly LocationRepository _locationRepository;

    public SaleService(
        SaleRepository saleRepository,
        InventoryService inventoryService,
        DrinkRepository drinkRepository,
        LocationRepository locationRepository
    )
    {
        _saleRepository = saleRepository;
        _inventoryService = inventoryService;
        _drinkRepository = drinkRepository;
        _locationRepository = locationRepository;
    }

    public async Task<List<Sale>> GetAllAsync()
    {
        return await _saleRepository.GetAllAsync();
    }

    public async Task<Sale?> GetByIdAsync(string id)
    {
        return await _saleRepository.GetByIdAsync(id);
    }

    public async Task<List<Sale>> GetByLocationIdAsync(
        string locationId
    )
    {
        return await _saleRepository.GetByLocationIdAsync(
            locationId
        );
    }

    public async Task<(
        bool Success,
        string Message,
        Sale? Sale
    )> CreateAsync(CreateSaleDto dto)
    {
        if (dto.Quantity <= 0)
        {
            return (
                false,
                "Sale quantity must be greater than zero.",
                null
            );
        }

        var location =
            await _locationRepository.GetByIdAsync(
                dto.LocationId
            );

        if (location is null)
        {
            return (
                false,
                "Sales location not found.",
                null
            );
        }

        if (!location.IsActive)
        {
            return (
                false,
                "The selected sales location is inactive.",
                null
            );
        }

        if (location.Type != "SalesArea")
        {
            return (
                false,
                "Sales can only be recorded from a SalesArea location.",
                null
            );
        }

        var drink =
            await _drinkRepository.GetByIdAsync(
                dto.DrinkId
            );

        if (drink is null)
        {
            return (
                false,
                "Drink not found.",
                null
            );
        }

        if (!drink.IsActive)
        {
            return (
                false,
                "The selected drink is inactive.",
                null
            );
        }

        var unitSellingPrice =
            dto.UnitSellingPrice > 0
                ? dto.UnitSellingPrice
                : drink.SellingPrice;

        if (unitSellingPrice <= 0)
        {
            return (
                false,
                "The selling price must be greater than zero.",
                null
            );
        }

        var unitBuyingPrice =
            drink.BuyingPrice;

        var totalAmount =
            dto.Quantity *
            unitSellingPrice;

        var totalCost =
            dto.Quantity *
            unitBuyingPrice;

        var profit =
            totalAmount -
            totalCost;

        var sale = new Sale
        {
            SaleNumber =
                GenerateSaleNumber(),

            LocationId =
                dto.LocationId,

            DrinkId =
                dto.DrinkId,

            Quantity =
                dto.Quantity,

            UnitSellingPrice =
                unitSellingPrice,

            UnitBuyingPrice =
                unitBuyingPrice,

            TotalAmount =
                totalAmount,

            TotalCost =
                totalCost,

            Profit =
                profit,

            PaymentMethod =
                dto.PaymentMethod?.Trim() ??
                string.Empty,

            CustomerName =
                dto.CustomerName?.Trim() ??
                string.Empty,

            Notes =
                dto.Notes?.Trim() ??
                string.Empty,

            Status =
                "Completed",

            SaleDate =
                dto.SaleDate ??
                DateTime.UtcNow,

            CreatedAt =
                DateTime.UtcNow,

            UpdatedAt =
                DateTime.UtcNow
        };

        var stockResult =
            await _inventoryService.DecreaseStockAsync(
                dto.DrinkId,
                dto.LocationId,
                dto.Quantity
            );

        if (!stockResult.Success)
        {
            return (
                false,
                stockResult.Message,
                null
            );
        }

        try
        {
            await _saleRepository.CreateAsync(
                sale
            );
        }
        catch
        {
            await _inventoryService.IncreaseStockAsync(
                dto.DrinkId,
                dto.LocationId,
                dto.Quantity,
                drink.MinimumStock
            );

            return (
                false,
                "The sale could not be saved. The stock reduction was reversed.",
                null
            );
        }

        return (
            true,
            "Sale completed successfully and inventory decreased.",
            sale
        );
    }

    public async Task<(
        bool Success,
        string Message
    )> UpdateAsync(
        string id,
        UpdateSaleDto dto
    )
    {
        var existingSale =
            await _saleRepository.GetByIdAsync(
                id
            );

        if (existingSale is null)
        {
            return (
                false,
                "Sale not found."
            );
        }

        existingSale.PaymentMethod =
            dto.PaymentMethod?.Trim() ??
            string.Empty;

        existingSale.CustomerName =
            dto.CustomerName?.Trim() ??
            string.Empty;

        existingSale.Notes =
            dto.Notes?.Trim() ??
            string.Empty;

        existingSale.UpdatedAt =
            DateTime.UtcNow;

        var updated =
            await _saleRepository.UpdateAsync(
                id,
                existingSale
            );

        if (!updated)
        {
            return (
                false,
                "Sale could not be updated."
            );
        }

        return (
            true,
            "Sale updated successfully."
        );
    }

    public async Task<(
        bool Success,
        string Message
    )> DeleteAsync(string id)
    {
        var existingSale =
            await _saleRepository.GetByIdAsync(
                id
            );

        if (existingSale is null)
        {
            return (
                false,
                "Sale not found."
            );
        }

        return (
            false,
            "Completed sales cannot be deleted because inventory has already been reduced."
        );
    }

    private static string GenerateSaleNumber()
    {
        return
            $"SAL-{DateTime.UtcNow:yyyyMMddHHmmssfff}";
    }
}