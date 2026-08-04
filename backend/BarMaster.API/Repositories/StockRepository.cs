using BarMaster.API.Data;
using BarMaster.API.Models;
using MongoDB.Driver;

namespace BarMaster.API.Repositories;

public class StockRepository
{
    private readonly MongoDbContext _context;

    public StockRepository(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<List<Stock>> GetAllAsync()
    {
        return await _context.Stocks
            .Find(_ => true)
            .SortByDescending(stock => stock.LastUpdated)
            .ToListAsync();
    }

    public async Task<Stock?> GetByIdAsync(string id)
    {
        return await _context.Stocks
            .Find(stock => stock.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task<Stock?> GetByDrinkIdAsync(string drinkId)
    {
        return await _context.Stocks
            .Find(stock => stock.DrinkId == drinkId)
            .FirstOrDefaultAsync();
    }

    public async Task CreateAsync(Stock stock)
    {
        await _context.Stocks.InsertOneAsync(stock);
    }

    public async Task<bool> UpdateAsync(
        string id,
        Stock updatedStock
    )
    {
        var result = await _context.Stocks.ReplaceOneAsync(
            stock => stock.Id == id,
            updatedStock
        );

        return result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var result = await _context.Stocks.DeleteOneAsync(
            stock => stock.Id == id
        );

        return result.DeletedCount > 0;
    }
}