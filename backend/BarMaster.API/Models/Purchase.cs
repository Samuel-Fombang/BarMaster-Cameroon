using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BarMaster.API.Models;

public class Purchase
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("purchaseNumber")]
    public string PurchaseNumber { get; set; } = string.Empty;

    [BsonElement("supplierId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string SupplierId { get; set; } = string.Empty;

    [BsonElement("destinationLocationId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string DestinationLocationId { get; set; } = string.Empty;

    [BsonElement("drinkId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string DrinkId { get; set; } = string.Empty;

    [BsonElement("quantity")]
    public int Quantity { get; set; }

    [BsonElement("unitBuyingPrice")]
    public decimal UnitBuyingPrice { get; set; }

    [BsonElement("totalAmount")]
    public decimal TotalAmount { get; set; }

    [BsonElement("invoiceNumber")]
    public string InvoiceNumber { get; set; } = string.Empty;

    [BsonElement("paymentStatus")]
    public string PaymentStatus { get; set; } = "Paid";

    [BsonElement("notes")]
    public string Notes { get; set; } = string.Empty;

    [BsonElement("status")]
    public string Status { get; set; } = "Completed";

    [BsonElement("purchaseDate")]
    public DateTime PurchaseDate { get; set; } = DateTime.UtcNow;

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}