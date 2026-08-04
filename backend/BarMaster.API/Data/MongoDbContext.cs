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
        var client = new MongoClient(
            settings.Value.ConnectionString
        );

        _database = client.GetDatabase(
            settings.Value.DatabaseName
        );
    }

    public IMongoCollection<Drink> Drinks =>
        _database.GetCollection<Drink>("Drinks");

    public IMongoCollection<Category> Categories =>
        _database.GetCollection<Category>("Categories");

    public IMongoCollection<Brand> Brands =>
        _database.GetCollection<Brand>("Brands");

    public IMongoCollection<Supplier> Suppliers =>
        _database.GetCollection<Supplier>("Suppliers");

    public IMongoCollection<Stock> Stocks =>
        _database.GetCollection<Stock>("Stocks");

    public IMongoCollection<Location> Locations =>
        _database.GetCollection<Location>("Locations");

    public IMongoCollection<Inventory> Inventory =>
        _database.GetCollection<Inventory>("Inventory");

    public IMongoCollection<Transfer> Transfers =>
        _database.GetCollection<Transfer>("Transfers");

    public IMongoCollection<Purchase> Purchases =>
        _database.GetCollection<Purchase>("Purchases");

    public IMongoCollection<Sale> Sales =>
        _database.GetCollection<Sale>("Sales");

    public IMongoCollection<Expense> Expenses =>
        _database.GetCollection<Expense>("Expenses");

    public IMongoCollection<Worker> Workers =>
        _database.GetCollection<Worker>("Workers");

    public IMongoCollection<PasswordResetCode>
        PasswordResetCodes =>
            _database.GetCollection<PasswordResetCode>(
                "PasswordResetCodes"
            );
}