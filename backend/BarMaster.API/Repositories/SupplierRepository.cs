using BarMaster.API.Data;
using BarMaster.API.Models;
using MongoDB.Driver;

namespace BarMaster.API.Repositories;

public class SupplierRepository
{
    private readonly MongoDbContext _context;

    public SupplierRepository(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<List<Supplier>> GetAllAsync()
    {
        return await _context.Suppliers
            .Find(_ => true)
            .SortBy(supplier => supplier.Name)
            .ToListAsync();
    }

    public async Task<Supplier?> GetByIdAsync(string id)
    {
        return await _context.Suppliers
            .Find(supplier => supplier.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task<Supplier?> GetByNameAsync(string name)
    {
        return await _context.Suppliers
            .Find(supplier =>
                supplier.Name.ToLower() == name.ToLower()
            )
            .FirstOrDefaultAsync();
    }

    public async Task CreateAsync(Supplier supplier)
    {
        await _context.Suppliers.InsertOneAsync(supplier);
    }

    public async Task<bool> UpdateAsync(
        string id,
        Supplier updatedSupplier
    )
    {
        var result = await _context.Suppliers.ReplaceOneAsync(
            supplier => supplier.Id == id,
            updatedSupplier
        );

        return result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var result = await _context.Suppliers.DeleteOneAsync(
            supplier => supplier.Id == id
        );

        return result.DeletedCount > 0;
    }
}