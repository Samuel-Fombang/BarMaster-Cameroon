using BarMaster.API.DTOs;
using BarMaster.API.Models;
using BarMaster.API.Repositories;

namespace BarMaster.API.Services;

public class DrinkService
{
    private readonly DrinkRepository _repository;

    public DrinkService(DrinkRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<Drink>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<Drink?> GetByIdAsync(string id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<Drink> CreateAsync(CreateDrinkDto dto)
    {
        var drink = new Drink
        {
            Name = dto.Name.Trim(),
            Category = dto.Category.Trim(),
            Brand = dto.Brand.Trim(),
            BottleSize = dto.BottleSize.Trim(),
            BuyingPrice = dto.BuyingPrice,
            SellingPrice = dto.SellingPrice,
            CurrentStock = dto.CurrentStock,
            MinimumStock = dto.MinimumStock,
            Supplier = dto.Supplier.Trim(),
            IsActive = dto.IsActive
        };

        await _repository.CreateAsync(drink);

        return drink;
    }

    public async Task<bool> UpdateAsync(
        string id,
        UpdateDrinkDto dto
    )
    {
        var existingDrink =
            await _repository.GetByIdAsync(id);

        if (existingDrink is null)
        {
            return false;
        }

        existingDrink.Name = dto.Name.Trim();
        existingDrink.Category = dto.Category.Trim();
        existingDrink.Brand = dto.Brand.Trim();
        existingDrink.BottleSize = dto.BottleSize.Trim();
        existingDrink.BuyingPrice = dto.BuyingPrice;
        existingDrink.SellingPrice = dto.SellingPrice;
        existingDrink.CurrentStock = dto.CurrentStock;
        existingDrink.MinimumStock = dto.MinimumStock;
        existingDrink.Supplier = dto.Supplier.Trim();
        existingDrink.IsActive = dto.IsActive;

        return await _repository.UpdateAsync(
            id,
            existingDrink
        );
    }

    public async Task<bool> DeleteAsync(string id)
    {
        return await _repository.DeleteAsync(id);
    }
}