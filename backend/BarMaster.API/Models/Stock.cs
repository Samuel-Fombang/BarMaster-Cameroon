using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BarMaster.API.Models;

public class Stock
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("drinkId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string DrinkId { get; set; } = string.Empty;

    [BsonElement("currentQuantity")]
    public int CurrentQuantity { get; set; }

    [BsonElement("minimumQuantity")]
    public int MinimumQuantity { get; set; }

    [BsonElement("lastUpdated")]
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

    [BsonElement("isActive")]
    public bool IsActive { get; set; } = true;
}