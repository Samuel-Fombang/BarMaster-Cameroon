using BarMaster.API.Data;
using BarMaster.API.Models;
using MongoDB.Driver;

namespace BarMaster.API.Repositories;

public class CategoryRepository
{
    private readonly MongoDbContext _context;

    public CategoryRepository(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<List<Category>> GetAllAsync()
    {
        return await _context.Categories
            .Find(_ => true)
            .SortBy(category => category.Name)
            .ToListAsync();
    }

    public async Task<Category?> GetByIdAsync(string id)
    {
        return await _context.Categories
            .Find(category => category.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task<Category?> GetByNameAsync(string name)
    {
        return await _context.Categories
            .Find(category =>
                category.Name.ToLower() == name.ToLower()
            )
            .FirstOrDefaultAsync();
    }

    public async Task CreateAsync(Category category)
    {
        await _context.Categories.InsertOneAsync(category);
    }

    public async Task<bool> UpdateAsync(
        string id,
        Category updatedCategory
    )
    {
        var result = await _context.Categories.ReplaceOneAsync(
            category => category.Id == id,
            updatedCategory
        );

        return result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var result = await _context.Categories.DeleteOneAsync(
            category => category.Id == id
        );

        return result.DeletedCount > 0;
    }
}