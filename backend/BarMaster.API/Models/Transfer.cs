using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BarMaster.API.Models;

public class Transfer
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("transferNumber")]
    public string TransferNumber { get; set; } = string.Empty;

    [BsonElement("sourceLocationId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string SourceLocationId { get; set; } = string.Empty;

    [BsonElement("destinationLocationId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string DestinationLocationId { get; set; } = string.Empty;

    [BsonElement("drinkId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string DrinkId { get; set; } = string.Empty;

    [BsonElement("quantity")]
    public int Quantity { get; set; }

    [BsonElement("reason")]
    public string Reason { get; set; } = string.Empty;

    [BsonElement("status")]
    public string Status { get; set; } = "Completed";

    [BsonElement("transferDate")]
    public DateTime TransferDate { get; set; } = DateTime.UtcNow;

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}