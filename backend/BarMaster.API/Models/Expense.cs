using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BarMaster.API.Models;

public class Expense
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("expenseNumber")]
    public string ExpenseNumber { get; set; } = string.Empty;

    [BsonElement("category")]
    public string Category { get; set; } = string.Empty;

    [BsonElement("description")]
    public string Description { get; set; } = string.Empty;

    [BsonElement("amount")]
    public decimal Amount { get; set; }

    [BsonElement("paymentMethod")]
    public string PaymentMethod { get; set; } = "Cash";

    [BsonElement("referenceNumber")]
    public string ReferenceNumber { get; set; } = string.Empty;

    [BsonElement("notes")]
    public string Notes { get; set; } = string.Empty;

    [BsonElement("status")]
    public string Status { get; set; } = "Completed";

    [BsonElement("expenseDate")]
    public DateTime ExpenseDate { get; set; } = DateTime.UtcNow;

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}