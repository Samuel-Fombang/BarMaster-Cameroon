using BarMaster.API.Data;
using BarMaster.API.Models;
using MongoDB.Driver;

namespace BarMaster.API.Repositories;

public class LocationRepository
{
    private readonly MongoDbContext _context;

    public LocationRepository(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<List<Location>> GetAllAsync()
    {
        return await _context.Locations
            .Find(_ => true)
            .SortBy(location => location.Name)
            .ToListAsync();
    }

    public async Task<Location?> GetByIdAsync(string id)
    {
        return await _context.Locations
            .Find(location => location.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task<Location?> GetByNameAsync(string name)
    {
        return await _context.Locations
            .Find(location =>
                location.Name.ToLower() == name.ToLower()
            )
            .FirstOrDefaultAsync();
    }

    public async Task CreateAsync(Location location)
    {
        await _context.Locations.InsertOneAsync(location);
    }

    public async Task<bool> UpdateAsync(
        string id,
        Location updatedLocation
    )
    {
        var result = await _context.Locations.ReplaceOneAsync(
            location => location.Id == id,
            updatedLocation
        );

        return result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var result = await _context.Locations.DeleteOneAsync(
            location => location.Id == id
        );

        return result.DeletedCount > 0;
    }
}