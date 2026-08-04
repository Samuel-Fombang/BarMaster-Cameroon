using BarMaster.API.DTOs;
using BarMaster.API.Models;
using BarMaster.API.Repositories;

namespace BarMaster.API.Services;

public class TransferService
{
    private readonly TransferRepository _transferRepository;
    private readonly InventoryService _inventoryService;
    private readonly DrinkRepository _drinkRepository;
    private readonly LocationRepository _locationRepository;

    public TransferService(
        TransferRepository transferRepository,
        InventoryService inventoryService,
        DrinkRepository drinkRepository,
        LocationRepository locationRepository
    )
    {
        _transferRepository = transferRepository;
        _inventoryService = inventoryService;
        _drinkRepository = drinkRepository;
        _locationRepository = locationRepository;
    }

    public async Task<List<Transfer>> GetAllAsync()
    {
        return await _transferRepository.GetAllAsync();
    }

    public async Task<Transfer?> GetByIdAsync(string id)
    {
        return await _transferRepository.GetByIdAsync(id);
    }

    public async Task<(
        bool Success,
        string Message,
        Transfer? Transfer
    )> CreateAsync(CreateTransferDto dto)
    {
        if (dto.Quantity <= 0)
        {
            return (
                false,
                "Transfer quantity must be greater than zero.",
                null
            );
        }

        if (dto.SourceLocationId == dto.DestinationLocationId)
        {
            return (
                false,
                "Source and destination locations cannot be the same.",
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

        var sourceLocation =
            await _locationRepository.GetByIdAsync(
                dto.SourceLocationId
            );

        if (sourceLocation is null)
        {
            return (
                false,
                "Source location not found.",
                null
            );
        }

        if (!sourceLocation.IsActive)
        {
            return (
                false,
                "The selected source location is inactive.",
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

        var transfer = new Transfer
        {
            TransferNumber =
                GenerateTransferNumber(),

            SourceLocationId =
                dto.SourceLocationId,

            DestinationLocationId =
                dto.DestinationLocationId,

            DrinkId =
                dto.DrinkId,

            Quantity =
                dto.Quantity,

            Reason =
                dto.Reason?.Trim() ??
                string.Empty,

            Status =
                "Completed",

            TransferDate =
                dto.TransferDate ??
                DateTime.UtcNow,

            CreatedAt =
                DateTime.UtcNow,

            UpdatedAt =
                DateTime.UtcNow
        };

        var stockResult =
            await _inventoryService.TransferStockAsync(
                dto.DrinkId,
                dto.SourceLocationId,
                dto.DestinationLocationId,
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
            await _transferRepository.CreateAsync(
                transfer
            );
        }
        catch
        {
            var reverseResult =
                await _inventoryService.TransferStockAsync(
                    dto.DrinkId,
                    dto.DestinationLocationId,
                    dto.SourceLocationId,
                    dto.Quantity
                );

            var message =
                reverseResult.Success
                    ? "The transfer could not be saved. The inventory movement was reversed."
                    : "The transfer could not be saved, and the inventory movement could not be reversed automatically.";

            return (
                false,
                message,
                null
            );
        }

        return (
            true,
            "Transfer completed successfully and inventory updated.",
            transfer
        );
    }

    public async Task<(
        bool Success,
        string Message
    )> UpdateAsync(
        string id,
        UpdateTransferDto dto
    )
    {
        var existingTransfer =
            await _transferRepository.GetByIdAsync(
                id
            );

        if (existingTransfer is null)
        {
            return (
                false,
                "Transfer not found."
            );
        }

        existingTransfer.Reason =
            dto.Reason?.Trim() ??
            string.Empty;

        existingTransfer.Status =
            dto.Status?.Trim() ??
            existingTransfer.Status;

        existingTransfer.UpdatedAt =
            DateTime.UtcNow;

        var updated =
            await _transferRepository.UpdateAsync(
                id,
                existingTransfer
            );

        if (!updated)
        {
            return (
                false,
                "Transfer could not be updated."
            );
        }

        return (
            true,
            "Transfer updated successfully."
        );
    }

    public async Task<(
        bool Success,
        string Message
    )> DeleteAsync(string id)
    {
        var existingTransfer =
            await _transferRepository.GetByIdAsync(
                id
            );

        if (existingTransfer is null)
        {
            return (
                false,
                "Transfer not found."
            );
        }

        return (
            false,
            "Completed transfers cannot be deleted because inventory has already moved."
        );
    }

    private static string GenerateTransferNumber()
    {
        return
            $"TRF-{DateTime.UtcNow:yyyyMMddHHmmssfff}";
    }
}