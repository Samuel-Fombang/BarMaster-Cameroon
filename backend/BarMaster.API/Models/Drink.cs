using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BarMaster.API.Models;

public class Drink
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string Brand { get; set; } = string.Empty;

    public string BottleSize { get; set; } = string.Empty;

    public decimal BuyingPrice { get; set; }

    public decimal SellingPrice { get; set; }

    public int CurrentStock { get; set; }

    public int MinimumStock { get; set; }

    public string Supplier { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;
}