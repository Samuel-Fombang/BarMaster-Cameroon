using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BarMaster.API.Models;

public class Sale
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("saleNumber")]
    public string SaleNumber { get; set; } = string.Empty;

    [BsonElement("locationId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string LocationId { get; set; } = string.Empty;

    [BsonElement("drinkId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string DrinkId { get; set; } = string.Empty;

    [BsonElement("quantity")]
    public int Quantity { get; set; }

    [BsonElement("unitSellingPrice")]
    public decimal UnitSellingPrice { get; set; }

    [BsonElement("unitBuyingPrice")]
    public decimal UnitBuyingPrice { get; set; }

    [BsonElement("totalAmount")]
    public decimal TotalAmount { get; set; }

    [BsonElement("totalCost")]
    public decimal TotalCost { get; set; }

    [BsonElement("profit")]
    public decimal Profit { get; set; }

    [BsonElement("paymentMethod")]
    public string PaymentMethod { get; set; } = "Cash";

    [BsonElement("customerName")]
    public string CustomerName { get; set; } = string.Empty;

    [BsonElement("notes")]
    public string Notes { get; set; } = string.Empty;

    [BsonElement("status")]
    public string Status { get; set; } = "Completed";

    [BsonElement("saleDate")]
    public DateTime SaleDate { get; set; } = DateTime.UtcNow;

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}