using BarMaster.API.DTOs;
using BarMaster.API.Models;
using BarMaster.API.Repositories;

namespace BarMaster.API.Services;

public class StockService
{
    private readonly StockRepository _stockRepository;
    private readonly DrinkRepository _drinkRepository;

    public StockService(
        StockRepository stockRepository,
        DrinkRepository drinkRepository
    )
    {
        _stockRepository = stockRepository;
        _drinkRepository = drinkRepository;
    }

    public async Task<List<Stock>> GetAllAsync()
    {
        return await _stockRepository.GetAllAsync();
    }

    public async Task<Stock?> GetByIdAsync(string id)
    {
        return await _stockRepository.GetByIdAsync(id);
    }

    public async Task<Stock?> GetByDrinkIdAsync(string drinkId)
    {
        return await _stockRepository.GetByDrinkIdAsync(drinkId);
    }

    public async Task<(bool Success, string Message, Stock? Stock)> CreateAsync(
        CreateStockDto dto
    )
    {
        var drink = await _drinkRepository.GetByIdAsync(dto.DrinkId);

        if (drink is null)
        {
            return (false, "Drink not found.", null);
        }

        var existingStock =
            await _stockRepository.GetByDrinkIdAsync(dto.DrinkId);

        if (existingStock is not null)
        {
            return (
                false,
                "A stock record already exists for this drink.",
                null
            );
        }

        var stock = new Stock
        {
            DrinkId = dto.DrinkId,
            CurrentQuantity = dto.CurrentQuantity,
            MinimumQuantity = dto.MinimumQuantity,
            LastUpdated = DateTime.UtcNow,
            IsActive = dto.IsActive
        };

        await _stockRepository.CreateAsync(stock);

        return (
            true,
            "Stock record created successfully.",
            stock
        );
    }

    public async Task<(bool Success, string Message)> UpdateAsync(
        string id,
        UpdateStockDto dto
    )
    {
        var existingStock = await _stockRepository.GetByIdAsync(id);

        if (existingStock is null)
        {
            return (false, "Stock record not found.");
        }

        existingStock.CurrentQuantity = dto.CurrentQuantity;
        existingStock.MinimumQuantity = dto.MinimumQuantity;
        existingStock.LastUpdated = DateTime.UtcNow;
        existingStock.IsActive = dto.IsActive;

        await _stockRepository.UpdateAsync(id, existingStock);

        return (true, "Stock record updated successfully.");
    }

    public async Task<(bool Success, string Message)> DeleteAsync(string id)
    {
        var existingStock = await _stockRepository.GetByIdAsync(id);

        if (existingStock is null)
        {
            return (false, "Stock record not found.");
        }

        await _stockRepository.DeleteAsync(id);

        return (true, "Stock record deleted successfully.");
    }
}