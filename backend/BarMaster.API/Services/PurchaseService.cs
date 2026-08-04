using BarMaster.API.DTOs;
using BarMaster.API.Models;
using BarMaster.API.Repositories;

namespace BarMaster.API.Services;

public class PurchaseService
{
    private readonly PurchaseRepository _purchaseRepository;
    private readonly InventoryService _inventoryService;
    private readonly SupplierRepository _supplierRepository;
    private readonly DrinkRepository _drinkRepository;
    private readonly LocationRepository _locationRepository;

    public PurchaseService(
        PurchaseRepository purchaseRepository,
        InventoryService inventoryService,
        SupplierRepository supplierRepository,
        DrinkRepository drinkRepository,
        LocationRepository locationRepository
    )
    {
        _purchaseRepository = purchaseRepository;
        _inventoryService = inventoryService;
        _supplierRepository = supplierRepository;
        _drinkRepository = drinkRepository;
        _locationRepository = locationRepository;
    }

    public async Task<List<Purchase>> GetAllAsync()
    {
        return await _purchaseRepository.GetAllAsync();
    }

    public async Task<Purchase?> GetByIdAsync(string id)
    {
        return await _purchaseRepository.GetByIdAsync(id);
    }

    public async Task<List<Purchase>> GetBySupplierIdAsync(
        string supplierId
    )
    {
        return await _purchaseRepository.GetBySupplierIdAsync(
            supplierId
        );
    }

    public async Task<(
        bool Success,
        string Message,
        Purchase? Purchase
    )> CreateAsync(CreatePurchaseDto dto)
    {
        if (dto.Quantity <= 0)
        {
            return (
                false,
                "Purchase quantity must be greater than zero.",
                null
            );
        }

        if (dto.UnitBuyingPrice < 0)
        {
            return (
                false,
                "Unit buying price cannot be negative.",
                null
            );
        }

        var supplier =
            await _supplierRepository.GetByIdAsync(
                dto.SupplierId
            );

        if (supplier is null)
        {
            return (
                false,
                "Supplier not found.",
                null
            );
        }

        if (!supplier.IsActive)
        {
            return (
                false,
                "The selected supplier is inactive.",
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

        var destinationLocation =
            await _locationRepository.GetByIdAsync(
                dto.DestinationLocationId
            );

        if (destinationLocation is null)
        {
            return (
                false,
                "Destination location not found.",
                null
            );
        }

        if (!destinationLocation.IsActive)
        {
            return (
                false,
                "The selected destination location is inactive.",
                null
            );
        }

        if (destinationLocation.Type != "Warehouse")
        {
            return (
                false,
                "Purchases can only be received into a warehouse location.",
                null
            );
        }

        var totalAmount =
            dto.Quantity *
            dto.UnitBuyingPrice;

        var purchase = new Purchase
        {
            PurchaseNumber =
                GeneratePurchaseNumber(),

            SupplierId =
                dto.SupplierId,

            DestinationLocationId =
                dto.DestinationLocationId,

            DrinkId =
                dto.DrinkId,

            Quantity =
                dto.Quantity,

            UnitBuyingPrice =
                dto.UnitBuyingPrice,

            TotalAmount =
                totalAmount,

            InvoiceNumber =
                dto.InvoiceNumber?.Trim() ??
                string.Empty,

            PaymentStatus =
                dto.PaymentStatus?.Trim() ??
                string.Empty,

            Notes =
                dto.Notes?.Trim() ??
                string.Empty,

            Status =
                "Completed",

            PurchaseDate =
                dto.PurchaseDate ??
                DateTime.UtcNow,

            CreatedAt =
                DateTime.UtcNow,

            UpdatedAt =
                DateTime.UtcNow
        };

        var stockResult =
            await _inventoryService.IncreaseStockAsync(
                dto.DrinkId,
                dto.DestinationLocationId,
                dto.Quantity,
                drink.MinimumStock
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
            await _purchaseRepository.CreateAsync(
                purchase
            );
        }
        catch
        {
            await _inventoryService.DecreaseStockAsync(
                dto.DrinkId,
                dto.DestinationLocationId,
                dto.Quantity
            );

            return (
                false,
                "The purchase could not be saved. The inventory increase was reversed.",
                null
            );
        }

        return (
            true,
            "Purchase completed successfully and inventory increased.",
            purchase
        );
    }

    public async Task<(
        bool Success,
        string Message
    )> UpdateAsync(
        string id,
        UpdatePurchaseDto dto
    )
    {
        var existingPurchase =
            await _purchaseRepository.GetByIdAsync(
                id
            );

        if (existingPurchase is null)
        {
            return (
                false,
                "Purchase not found."
            );
        }

        existingPurchase.InvoiceNumber =
            dto.InvoiceNumber?.Trim() ??
            string.Empty;

        existingPurchase.PaymentStatus =
            dto.PaymentStatus?.Trim() ??
            string.Empty;

        existingPurchase.Notes =
            dto.Notes?.Trim() ??
            string.Empty;

        existingPurchase.UpdatedAt =
            DateTime.UtcNow;

        var updated =
            await _purchaseRepository.UpdateAsync(
                id,
                existingPurchase
            );

        if (!updated)
        {
            return (
                false,
                "Purchase could not be updated."
            );
        }

        return (
            true,
            "Purchase updated successfully."
        );
    }

    public async Task<(
        bool Success,
        string Message
    )> DeleteAsync(string id)
    {
        var existingPurchase =
            await _purchaseRepository.GetByIdAsync(
                id
            );

        if (existingPurchase is null)
        {
            return (
                false,
                "Purchase not found."
            );
        }

        return (
            false,
            "Completed purchases cannot be deleted because inventory has already been received."
        );
    }

    private static string GeneratePurchaseNumber()
    {
        return
            $"PUR-{DateTime.UtcNow:yyyyMMddHHmmssfff}";
    }
}