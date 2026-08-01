using BarMaster.API.Models;
using BarMaster.API.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace BarMaster.API.Data;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;

    public MongoDbContext(IOptions<DatabaseSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        _database = client.GetDatabase(settings.Value.DatabaseName);
    }

    public IMongoCollection<Drink> Drinks =>
        _database.GetCollection<Drink>("Drinks");
}