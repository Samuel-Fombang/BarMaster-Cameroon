using BarMaster.API.Data;
using BarMaster.API.Models;
using MongoDB.Driver;

namespace BarMaster.API.Repositories;

public class DrinkRepository
{
    private readonly MongoDbContext _context;

    public DrinkRepository(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<List<Drink>> GetAllAsync()
    {
        return await _context.Drinks
            .Find(_ => true)
            .ToListAsync();
    }

    public async Task<Drink?> GetByIdAsync(string id)
    {
        return await _context.Drinks
            .Find(drink => drink.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task CreateAsync(Drink drink)
    {
        await _context.Drinks.InsertOneAsync(drink);
    }

    public async Task<bool> UpdateAsync(string id, Drink updatedDrink)
    {
        var result = await _context.Drinks.ReplaceOneAsync(
            drink => drink.Id == id,
            updatedDrink
        );

        return result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var result = await _context.Drinks.DeleteOneAsync(
            drink => drink.Id == id
        );

        return result.DeletedCount > 0;
    }
}