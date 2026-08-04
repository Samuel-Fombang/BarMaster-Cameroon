using BarMaster.API.DTOs;
using BarMaster.API.Models;
using BarMaster.API.Repositories;

namespace BarMaster.API.Services;

public class InventoryService
{
    private readonly InventoryRepository _inventoryRepository;
    private readonly DrinkRepository _drinkRepository;
    private readonly LocationRepository _locationRepository;

    public InventoryService(
        InventoryRepository inventoryRepository,
        DrinkRepository drinkRepository,
        LocationRepository locationRepository
    )
    {
        _inventoryRepository = inventoryRepository;
        _drinkRepository = drinkRepository;
        _locationRepository = locationRepository;
    }

    public async Task<List<Inventory>> GetAllAsync()
    {
        return await _inventoryRepository.GetAllAsync();
    }

    public async Task<Inventory?> GetByIdAsync(string id)
    {
        return await _inventoryRepository.GetByIdAsync(id);
    }

    public async Task<List<Inventory>> GetByLocationIdAsync(
        string locationId
    )
    {
        return await _inventoryRepository
            .GetByLocationIdAsync(locationId);
    }

    public async Task<List<Inventory>> GetByDrinkIdAsync(
        string drinkId
    )
    {
        return await _inventoryRepository
            .GetByDrinkIdAsync(drinkId);
    }

    public async Task<Inventory?> GetByDrinkAndLocationAsync(
        string drinkId,
        string locationId
    )
    {
        return await _inventoryRepository
            .GetByDrinkAndLocationAsync(
                drinkId,
                locationId
            );
    }

    public async Task<
        (bool Success, string Message, Inventory? Inventory)
    > CreateAsync(CreateInventoryDto dto)
    {
        if (dto.Quantity < 0)
        {
            return (
                false,
                "Inventory quantity cannot be negative.",
                null
            );
        }

        if (dto.MinimumQuantity < 0)
        {
            return (
                false,
                "Minimum quantity cannot be negative.",
                null
            );
        }

        var drink = await _drinkRepository.GetByIdAsync(
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

        var location = await _locationRepository.GetByIdAsync(
            dto.LocationId
        );

        if (location is null)
        {
            return (
                false,
                "Location not found.",
                null
            );
        }

        var existingInventory =
            await _inventoryRepository
                .GetByDrinkAndLocationAsync(
                    dto.DrinkId,
                    dto.LocationId
                );

        if (existingInventory is not null)
        {
            return (
                false,
                "An inventory record already exists for this drink at this location.",
                null
            );
        }

        var inventory = new Inventory
        {
            DrinkId = dto.DrinkId,
            LocationId = dto.LocationId,
            Quantity = dto.Quantity,
            MinimumQuantity = dto.MinimumQuantity,
            IsActive = dto.IsActive,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _inventoryRepository.CreateAsync(inventory);

        return (
            true,
            "Inventory record created successfully.",
            inventory
        );
    }

    public async Task<(bool Success, string Message)> UpdateAsync(
        string id,
        UpdateInventoryDto dto
    )
    {
        if (dto.Quantity < 0)
        {
            return (
                false,
                "Inventory quantity cannot be negative."
            );
        }

        if (dto.MinimumQuantity < 0)
        {
            return (
                false,
                "Minimum quantity cannot be negative."
            );
        }

        var existingInventory =
            await _inventoryRepository.GetByIdAsync(id);

        if (existingInventory is null)
        {
            return (
                false,
                "Inventory record not found."
            );
        }

        existingInventory.Quantity = dto.Quantity;
        existingInventory.MinimumQuantity =
            dto.MinimumQuantity;
        existingInventory.IsActive = dto.IsActive;
        existingInventory.UpdatedAt = DateTime.UtcNow;

        var updated =
            await _inventoryRepository.UpdateAsync(
                id,
                existingInventory
            );

        if (!updated)
        {
            return (
                false,
                "Inventory record could not be updated."
            );
        }

        return (
            true,
            "Inventory record updated successfully."
        );
    }

    public async Task<
        (bool Success, string Message, Inventory? Inventory)
    > IncreaseStockAsync(
        string drinkId,
        string locationId,
        int quantity,
        int minimumQuantity = 0
    )
    {
        if (quantity <= 0)
        {
            return (
                false,
                "Stock increase quantity must be greater than zero.",
                null
            );
        }

        var drink =
            await _drinkRepository.GetByIdAsync(drinkId);

        if (drink is null)
        {
            return (
                false,
                "Drink not found.",
                null
            );
        }

        var location =
            await _locationRepository.GetByIdAsync(locationId);

        if (location is null)
        {
            return (
                false,
                "Location not found.",
                null
            );
        }

        var inventory =
            await _inventoryRepository
                .GetByDrinkAndLocationAsync(
                    drinkId,
                    locationId
                );

        if (inventory is null)
        {
            inventory = new Inventory
            {
                DrinkId = drinkId,
                LocationId = locationId,
                Quantity = quantity,
                MinimumQuantity = Math.Max(
                    minimumQuantity,
                    0
                ),
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _inventoryRepository.CreateAsync(
                inventory
            );

            return (
                true,
                "Stock increased successfully.",
                inventory
            );
        }

        inventory.Quantity += quantity;
        inventory.UpdatedAt = DateTime.UtcNow;

        if (
            inventory.MinimumQuantity == 0 &&
            minimumQuantity > 0
        )
        {
            inventory.MinimumQuantity =
                minimumQuantity;
        }

        if (inventory.Id is null)
        {
            return (
                false,
                "Inventory record ID is missing.",
                null
            );
        }

        var updated =
            await _inventoryRepository.UpdateAsync(
                inventory.Id,
                inventory
            );

        if (!updated)
        {
            return (
                false,
                "Stock could not be increased.",
                null
            );
        }

        return (
            true,
            "Stock increased successfully.",
            inventory
        );
    }

    public async Task<
        (bool Success, string Message, Inventory? Inventory)
    > DecreaseStockAsync(
        string drinkId,
        string locationId,
        int quantity
    )
    {
        if (quantity <= 0)
        {
            return (
                false,
                "Stock decrease quantity must be greater than zero.",
                null
            );
        }

        var inventory =
            await _inventoryRepository
                .GetByDrinkAndLocationAsync(
                    drinkId,
                    locationId
                );

        if (inventory is null)
        {
            return (
                false,
                "No inventory record exists for this drink at this location.",
                null
            );
        }

        if (inventory.Quantity < quantity)
        {
            return (
                false,
                $"Insufficient stock. Available quantity is {inventory.Quantity}.",
                inventory
            );
        }

        inventory.Quantity -= quantity;
        inventory.UpdatedAt = DateTime.UtcNow;

        if (inventory.Id is null)
        {
            return (
                false,
                "Inventory record ID is missing.",
                null
            );
        }

        var updated =
            await _inventoryRepository.UpdateAsync(
                inventory.Id,
                inventory
            );

        if (!updated)
        {
            return (
                false,
                "Stock could not be decreased.",
                null
            );
        }

        return (
            true,
            "Stock decreased successfully.",
            inventory
        );
    }

    public async Task<(bool Success, string Message)> TransferStockAsync(
        string drinkId,
        string fromLocationId,
        string toLocationId,
        int quantity
    )
    {
        if (quantity <= 0)
        {
            return (
                false,
                "Transfer quantity must be greater than zero."
            );
        }

        if (fromLocationId == toLocationId)
        {
            return (
                false,
                "Source and destination locations must be different."
            );
        }

        var sourceInventory =
            await _inventoryRepository
                .GetByDrinkAndLocationAsync(
                    drinkId,
                    fromLocationId
                );

        if (sourceInventory is null)
        {
            return (
                false,
                "No source inventory record exists for this drink."
            );
        }

        if (sourceInventory.Quantity < quantity)
        {
            return (
                false,
                $"Insufficient source stock. Available quantity is {sourceInventory.Quantity}."
            );
        }

        var destinationLocation =
            await _locationRepository.GetByIdAsync(
                toLocationId
            );

        if (destinationLocation is null)
        {
            return (
                false,
                "Destination location not found."
            );
        }

        var decreaseResult =
            await DecreaseStockAsync(
                drinkId,
                fromLocationId,
                quantity
            );

        if (!decreaseResult.Success)
        {
            return (
                false,
                decreaseResult.Message
            );
        }

        var increaseResult =
            await IncreaseStockAsync(
                drinkId,
                toLocationId,
                quantity,
                sourceInventory.MinimumQuantity
            );

        if (!increaseResult.Success)
        {
            await IncreaseStockAsync(
                drinkId,
                fromLocationId,
                quantity,
                sourceInventory.MinimumQuantity
            );

            return (
                false,
                $"Transfer failed: {increaseResult.Message}"
            );
        }

        return (
            true,
            "Stock transferred successfully."
        );
    }

    public async Task<(bool Success, string Message)> DeleteAsync(
        string id
    )
    {
        var existingInventory =
            await _inventoryRepository.GetByIdAsync(id);

        if (existingInventory is null)
        {
            return (
                false,
                "Inventory record not found."
            );
        }

        var deleted =
            await _inventoryRepository.DeleteAsync(id);

        if (!deleted)
        {
            return (
                false,
                "Inventory record could not be deleted."
            );
        }

        return (
            true,
            "Inventory record deleted successfully."
        );
    }
}