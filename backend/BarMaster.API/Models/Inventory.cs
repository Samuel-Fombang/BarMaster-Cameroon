using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BarMaster.API.Models;

public class Inventory
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("drinkId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string DrinkId { get; set; } = string.Empty;

    [BsonElement("locationId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string LocationId { get; set; } = string.Empty;

    [BsonElement("quantity")]
    public int Quantity { get; set; }

    [BsonElement("minimumQuantity")]
    public int MinimumQuantity { get; set; }

    [BsonElement("pricePerBottle")]
    public decimal PricePerBottle { get; set; }

    /*
     * This value is NOT stored separately in MongoDB.
     *
     * It is calculated every time from:
     *
     * Quantity × PricePerBottle
     *
     * This prevents the total from becoming outdated
     * when stock quantities change.
     */
    [BsonIgnore]
    public decimal TotalStockValue =>
        Quantity * PricePerBottle;

    [BsonElement("isActive")]
    public bool IsActive { get; set; } = true;

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}