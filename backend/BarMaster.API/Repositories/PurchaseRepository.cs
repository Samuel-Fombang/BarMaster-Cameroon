using BarMaster.API.Data;
using BarMaster.API.Models;
using MongoDB.Driver;

namespace BarMaster.API.Repositories;

public class PurchaseRepository
{
    private readonly MongoDbContext _context;

    public PurchaseRepository(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<List<Purchase>> GetAllAsync()
    {
        return await _context.Purchases
            .Find(_ => true)
            .SortByDescending(purchase => purchase.PurchaseDate)
            .ToListAsync();
    }

    public async Task<Purchase?> GetByIdAsync(string id)
    {
        return await _context.Purchases
            .Find(purchase => purchase.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task<Purchase?> GetByPurchaseNumberAsync(
        string purchaseNumber
    )
    {
        return await _context.Purchases
            .Find(purchase =>
                purchase.PurchaseNumber == purchaseNumber
            )
            .FirstOrDefaultAsync();
    }

    public async Task<List<Purchase>> GetBySupplierIdAsync(
        string supplierId
    )
    {
        return await _context.Purchases
            .Find(purchase =>
                purchase.SupplierId == supplierId
            )
            .SortByDescending(purchase => purchase.PurchaseDate)
            .ToListAsync();
    }

    public async Task CreateAsync(Purchase purchase)
    {
        await _context.Purchases.InsertOneAsync(purchase);
    }

    public async Task<bool> UpdateAsync(
        string id,
        Purchase updatedPurchase
    )
    {
        var result = await _context.Purchases.ReplaceOneAsync(
            purchase => purchase.Id == id,
            updatedPurchase
        );

        return result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var result = await _context.Purchases.DeleteOneAsync(
            purchase => purchase.Id == id
        );

        return result.DeletedCount > 0;
    }
}