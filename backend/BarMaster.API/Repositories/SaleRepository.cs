using BarMaster.API.Data;
using BarMaster.API.Models;
using MongoDB.Driver;

namespace BarMaster.API.Repositories;

public class SaleRepository
{
    private readonly MongoDbContext _context;

    public SaleRepository(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<List<Sale>> GetAllAsync()
    {
        return await _context.Sales
            .Find(_ => true)
            .SortByDescending(sale => sale.SaleDate)
            .ToListAsync();
    }

    public async Task<Sale?> GetByIdAsync(string id)
    {
        return await _context.Sales
            .Find(sale => sale.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task<Sale?> GetBySaleNumberAsync(
        string saleNumber
    )
    {
        return await _context.Sales
            .Find(sale => sale.SaleNumber == saleNumber)
            .FirstOrDefaultAsync();
    }

    public async Task<List<Sale>> GetByLocationIdAsync(
        string locationId
    )
    {
        return await _context.Sales
            .Find(sale => sale.LocationId == locationId)
            .SortByDescending(sale => sale.SaleDate)
            .ToListAsync();
    }

    public async Task CreateAsync(Sale sale)
    {
        await _context.Sales.InsertOneAsync(sale);
    }

    public async Task<bool> UpdateAsync(
        string id,
        Sale updatedSale
    )
    {
        var result = await _context.Sales.ReplaceOneAsync(
            sale => sale.Id == id,
            updatedSale
        );

        return result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var result = await _context.Sales.DeleteOneAsync(
            sale => sale.Id == id
        );

        return result.DeletedCount > 0;
    }
}