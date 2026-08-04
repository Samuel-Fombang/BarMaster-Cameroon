using BarMaster.API.Models;
using BarMaster.API.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace BarMaster.API.Repositories;

public class BottleSizeRepository
{
    private readonly IMongoCollection<BottleSize> _collection;

    public BottleSizeRepository(
        IOptions<DatabaseSettings> settings
    )
    {
        var mongoClient = new MongoClient(
            settings.Value.ConnectionString
        );

        var database = mongoClient.GetDatabase(
            settings.Value.DatabaseName
        );

        _collection =
            database.GetCollection<BottleSize>(
                "BottleSizes"
            );
    }

    public async Task<List<BottleSize>> GetAllAsync()
    {
        return await _collection
            .Find(_ => true)
            .SortBy(item => item.Name)
            .ToListAsync();
    }

    public async Task<BottleSize?> GetByIdAsync(
        string id
    )
    {
        return await _collection
            .Find(item => item.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task<BottleSize?> GetByNameAsync(
        string name
    )
    {
        var normalizedName =
            name.Trim().ToLower();

        return await _collection
            .Find(item =>
                item.Name.ToLower() ==
                normalizedName
            )
            .FirstOrDefaultAsync();
    }

    public async Task CreateAsync(
        BottleSize bottleSize
    )
    {
        await _collection.InsertOneAsync(
            bottleSize
        );
    }

    public async Task<bool> UpdateAsync(
        string id,
        BottleSize bottleSize
    )
    {
        var result =
            await _collection.ReplaceOneAsync(
                item => item.Id == id,
                bottleSize
            );

        return result.MatchedCount > 0;
    }

    public async Task<bool> DeleteAsync(
        string id
    )
    {
        var result =
            await _collection.DeleteOneAsync(
                item => item.Id == id
            );

        return result.DeletedCount > 0;
    }
}