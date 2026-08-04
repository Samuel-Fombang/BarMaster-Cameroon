using BarMaster.API.Data;
using BarMaster.API.Models;
using MongoDB.Driver;

namespace BarMaster.API.Repositories;

public class BrandRepository
{
    private readonly MongoDbContext _context;

    public BrandRepository(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<List<Brand>> GetAllAsync()
    {
        return await _context.Brands
            .Find(_ => true)
            .SortBy(brand => brand.Name)
            .ToListAsync();
    }

    public async Task<Brand?> GetByIdAsync(string id)
    {
        return await _context.Brands
            .Find(brand => brand.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task<Brand?> GetByNameAsync(string name)
    {
        return await _context.Brands
            .Find(brand =>
                brand.Name.ToLower() == name.ToLower()
            )
            .FirstOrDefaultAsync();
    }

    public async Task CreateAsync(Brand brand)
    {
        await _context.Brands.InsertOneAsync(brand);
    }

    public async Task<bool> UpdateAsync(
        string id,
        Brand updatedBrand
    )
    {
        var result = await _context.Brands.ReplaceOneAsync(
            brand => brand.Id == id,
            updatedBrand
        );

        return result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var result = await _context.Brands.DeleteOneAsync(
            brand => brand.Id == id
        );

        return result.DeletedCount > 0;
    }
}