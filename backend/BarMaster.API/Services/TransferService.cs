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

        if (dto.PricePerBottle <= 0)
        {
            return (
                false,
                "Price per bottle must be greater than zero.",
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

        var validation =
            await ValidateTransferReferencesAsync(
                dto.DrinkId,
                dto.SourceLocationId,
                dto.DestinationLocationId
            );

        if (!validation.Success)
        {
            return (
                false,
                validation.Message,
                null
            );
        }

        var transfer = new Transfer
        {
            TransferNumber = GenerateTransferNumber(),

            SourceLocationId = dto.SourceLocationId,

            DestinationLocationId =
                dto.DestinationLocationId,

            DrinkId = dto.DrinkId,

            Quantity = dto.Quantity,

            PricePerBottle = dto.PricePerBottle,

            TotalPrice =
                dto.Quantity * dto.PricePerBottle,

            Reason =
                dto.Reason?.Trim() ?? string.Empty,

            Status = "Completed",

            TransferDate =
                dto.TransferDate ?? DateTime.UtcNow,

            CreatedAt = DateTime.UtcNow,

            UpdatedAt = DateTime.UtcNow
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
            await _transferRepository.CreateAsync(transfer);
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
            await _transferRepository.GetByIdAsync(id);

        if (existingTransfer is null)
        {
            return (
                false,
                "Transfer not found."
            );
        }

        if (dto.Quantity <= 0)
        {
            return (
                false,
                "Transfer quantity must be greater than zero."
            );
        }

        if (dto.PricePerBottle <= 0)
        {
            return (
                false,
                "Price per bottle must be greater than zero."
            );
        }

        if (dto.SourceLocationId == dto.DestinationLocationId)
        {
            return (
                false,
                "Source and destination locations cannot be the same."
            );
        }

        var validation =
            await ValidateTransferReferencesAsync(
                dto.DrinkId,
                dto.SourceLocationId,
                dto.DestinationLocationId
            );

        if (!validation.Success)
        {
            return (
                false,
                validation.Message
            );
        }

        /*
         * Completed transfers have already affected inventory.
         *
         * Before editing, reverse the OLD movement:
         *
         * old destination -> old source
         */
        if (existingTransfer.Status == "Completed")
        {
            var reverseOldResult =
                await _inventoryService.TransferStockAsync(
                    existingTransfer.DrinkId,
                    existingTransfer.DestinationLocationId,
                    existingTransfer.SourceLocationId,
                    existingTransfer.Quantity
                );

            if (!reverseOldResult.Success)
            {
                return (
                    false,
                    "The existing transfer could not be reversed before editing. " +
                    reverseOldResult.Message
                );
            }
        }

        /*
         * Apply the NEW movement if the edited
         * transfer remains Completed.
         */
        if (dto.Status == "Completed")
        {
            var applyNewResult =
                await _inventoryService.TransferStockAsync(
                    dto.DrinkId,
                    dto.SourceLocationId,
                    dto.DestinationLocationId,
                    dto.Quantity
                );

            if (!applyNewResult.Success)
            {
                /*
                 * Restore the original movement because
                 * applying the edited movement failed.
                 */
                if (existingTransfer.Status == "Completed")
                {
                    await _inventoryService.TransferStockAsync(
                        existingTransfer.DrinkId,
                        existingTransfer.SourceLocationId,
                        existingTransfer.DestinationLocationId,
                        existingTransfer.Quantity
                    );
                }

                return (
                    false,
                    "The edited transfer could not be applied. " +
                    applyNewResult.Message
                );
            }
        }

        var oldTransfer = new Transfer
        {
            Id = existingTransfer.Id,
            TransferNumber = existingTransfer.TransferNumber,
            SourceLocationId = existingTransfer.SourceLocationId,
            DestinationLocationId =
                existingTransfer.DestinationLocationId,
            DrinkId = existingTransfer.DrinkId,
            Quantity = existingTransfer.Quantity,
            PricePerBottle = existingTransfer.PricePerBottle,
            TotalPrice = existingTransfer.TotalPrice,
            Reason = existingTransfer.Reason,
            Status = existingTransfer.Status,
            TransferDate = existingTransfer.TransferDate,
            CreatedAt = existingTransfer.CreatedAt,
            UpdatedAt = existingTransfer.UpdatedAt
        };

        existingTransfer.SourceLocationId =
            dto.SourceLocationId;

        existingTransfer.DestinationLocationId =
            dto.DestinationLocationId;

        existingTransfer.DrinkId =
            dto.DrinkId;

        existingTransfer.Quantity =
            dto.Quantity;

        existingTransfer.PricePerBottle =
            dto.PricePerBottle;

        existingTransfer.TotalPrice =
            dto.Quantity * dto.PricePerBottle;

        existingTransfer.Reason =
            dto.Reason?.Trim() ?? string.Empty;

        existingTransfer.Status =
            dto.Status?.Trim() ?? "Completed";

        if (dto.TransferDate.HasValue)
        {
            existingTransfer.TransferDate =
                dto.TransferDate.Value;
        }

        existingTransfer.UpdatedAt =
            DateTime.UtcNow;

        try
        {
            var updated =
                await _transferRepository.UpdateAsync(
                    id,
                    existingTransfer
                );

            if (!updated)
            {
                await RollbackEditedInventoryAsync(
                    oldTransfer,
                    existingTransfer
                );

                return (
                    false,
                    "Transfer could not be updated. Inventory changes were reversed."
                );
            }
        }
        catch
        {
            await RollbackEditedInventoryAsync(
                oldTransfer,
                existingTransfer
            );

            return (
                false,
                "Transfer could not be updated. Inventory changes were reversed."
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
            await _transferRepository.GetByIdAsync(id);

        if (existingTransfer is null)
        {
            return (
                false,
                "Transfer not found."
            );
        }

        /*
         * If the transfer was completed, its stock movement
         * must be reversed before deleting the record.
         *
         * Original:
         * source -> destination
         *
         * Delete reversal:
         * destination -> source
         */
        if (existingTransfer.Status == "Completed")
        {
            var reverseResult =
                await _inventoryService.TransferStockAsync(
                    existingTransfer.DrinkId,
                    existingTransfer.DestinationLocationId,
                    existingTransfer.SourceLocationId,
                    existingTransfer.Quantity
                );

            if (!reverseResult.Success)
            {
                return (
                    false,
                    "Transfer cannot be deleted because the inventory movement could not be reversed. " +
                    reverseResult.Message
                );
            }
        }

        try
        {
            var deleted =
                await _transferRepository.DeleteAsync(id);

            if (!deleted)
            {
                /*
                 * Database deletion failed.
                 * Put the stock movement back.
                 */
                if (existingTransfer.Status == "Completed")
                {
                    await _inventoryService.TransferStockAsync(
                        existingTransfer.DrinkId,
                        existingTransfer.SourceLocationId,
                        existingTransfer.DestinationLocationId,
                        existingTransfer.Quantity
                    );
                }

                return (
                    false,
                    "Transfer could not be deleted."
                );
            }
        }
        catch
        {
            /*
             * Database deletion threw an exception.
             * Restore the original stock movement.
             */
            if (existingTransfer.Status == "Completed")
            {
                await _inventoryService.TransferStockAsync(
                    existingTransfer.DrinkId,
                    existingTransfer.SourceLocationId,
                    existingTransfer.DestinationLocationId,
                    existingTransfer.Quantity
                );
            }

            return (
                false,
                "Transfer could not be deleted."
            );
        }

        return (
            true,
            "Transfer deleted successfully and inventory restored."
        );
    }

    private async Task<(
        bool Success,
        string Message
    )> ValidateTransferReferencesAsync(
        string drinkId,
        string sourceLocationId,
        string destinationLocationId
    )
    {
        var drink =
            await _drinkRepository.GetByIdAsync(drinkId);

        if (drink is null)
        {
            return (
                false,
                "Drink not found."
            );
        }

        if (!drink.IsActive)
        {
            return (
                false,
                "The selected drink is inactive."
            );
        }

        var sourceLocation =
            await _locationRepository.GetByIdAsync(
                sourceLocationId
            );

        if (sourceLocation is null)
        {
            return (
                false,
                "Source location not found."
            );
        }

        if (!sourceLocation.IsActive)
        {
            return (
                false,
                "The selected source location is inactive."
            );
        }

        var destinationLocation =
            await _locationRepository.GetByIdAsync(
                destinationLocationId
            );

        if (destinationLocation is null)
        {
            return (
                false,
                "Destination location not found."
            );
        }

        if (!destinationLocation.IsActive)
        {
            return (
                false,
                "The selected destination location is inactive."
            );
        }

        return (
            true,
            string.Empty
        );
    }

    private async Task RollbackEditedInventoryAsync(
        Transfer oldTransfer,
        Transfer newTransfer
    )
    {
        /*
         * Remove the newly applied movement.
         */
        if (newTransfer.Status == "Completed")
        {
            await _inventoryService.TransferStockAsync(
                newTransfer.DrinkId,
                newTransfer.DestinationLocationId,
                newTransfer.SourceLocationId,
                newTransfer.Quantity
            );
        }

        /*
         * Restore the original movement.
         */
        if (oldTransfer.Status == "Completed")
        {
            await _inventoryService.TransferStockAsync(
                oldTransfer.DrinkId,
                oldTransfer.SourceLocationId,
                oldTransfer.DestinationLocationId,
                oldTransfer.Quantity
            );
        }
    }

    private static string GenerateTransferNumber()
    {
        return
            $"TRF-{DateTime.UtcNow:yyyyMMddHHmmssfff}";
    }
}