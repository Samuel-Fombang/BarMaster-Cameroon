using BarMaster.API.Data;
using BarMaster.API.Models;
using MongoDB.Driver;

namespace BarMaster.API.Repositories;

public class InventoryRepository
{
    private readonly MongoDbContext _context;

    public InventoryRepository(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<List<Inventory>> GetAllAsync()
    {
        return await _context.Inventory
            .Find(_ => true)
            .SortBy(item => item.LocationId)
            .ThenBy(item => item.DrinkId)
            .ToListAsync();
    }

    public async Task<Inventory?> GetByIdAsync(string id)
    {
        return await _context.Inventory
            .Find(item => item.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task<List<Inventory>> GetByLocationIdAsync(
        string locationId
    )
    {
        return await _context.Inventory
            .Find(item => item.LocationId == locationId)
            .ToListAsync();
    }

    public async Task<List<Inventory>> GetByDrinkIdAsync(
        string drinkId
    )
    {
        return await _context.Inventory
            .Find(item => item.DrinkId == drinkId)
            .ToListAsync();
    }

    public async Task<Inventory?> GetByDrinkAndLocationAsync(
        string drinkId,
        string locationId
    )
    {
        return await _context.Inventory
            .Find(item =>
                item.DrinkId == drinkId &&
                item.LocationId == locationId
            )
            .FirstOrDefaultAsync();
    }

    public async Task CreateAsync(Inventory inventory)
    {
        await _context.Inventory.InsertOneAsync(inventory);
    }

    public async Task<bool> UpdateAsync(
        string id,
        Inventory updatedInventory
    )
    {
        var result = await _context.Inventory.ReplaceOneAsync(
            item => item.Id == id,
            updatedInventory
        );

        return result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var result = await _context.Inventory.DeleteOneAsync(
            item => item.Id == id
        );

        return result.DeletedCount > 0;
    }
}