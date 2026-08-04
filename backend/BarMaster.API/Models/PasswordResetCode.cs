using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BarMaster.API.Models;

public class PasswordResetCode
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("workerId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string WorkerId { get; set; } = string.Empty;

    [BsonElement("email")]
    public string Email { get; set; } = string.Empty;

    [BsonElement("codeHash")]
    public string CodeHash { get; set; } = string.Empty;

    [BsonElement("expiresAt")]
    public DateTime ExpiresAt { get; set; }

    [BsonElement("failedAttempts")]
    public int FailedAttempts { get; set; }

    [BsonElement("isVerified")]
    public bool IsVerified { get; set; }

    [BsonElement("verifiedAt")]
    public DateTime? VerifiedAt { get; set; }

    [BsonElement("resetTokenHash")]
    public string ResetTokenHash { get; set; } = string.Empty;

    [BsonElement("resetTokenExpiresAt")]
    public DateTime? ResetTokenExpiresAt { get; set; }

    [BsonElement("isUsed")]
    public bool IsUsed { get; set; }

    [BsonElement("usedAt")]
    public DateTime? UsedAt { get; set; }

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}