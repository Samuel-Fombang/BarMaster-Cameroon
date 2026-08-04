using System.ComponentModel.DataAnnotations;

namespace BarMaster.API.DTOs;

public class CreateExpenseDto
{
    [Required]
    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    [Required]
    [MaxLength(250)]
    public string Description { get; set; } = string.Empty;

    [Range(
        1,
        1000000000,
        ErrorMessage = "Amount must be greater than zero."
    )]
    public decimal Amount { get; set; }

    [Required]
    [RegularExpression(
        "^(Cash|MTN_MOMO|ORANGE_MONEY|Card|BankTransfer)$",
        ErrorMessage =
            "Payment method must be Cash, MTN_MOMO, ORANGE_MONEY, Card or BankTransfer."
    )]
    public string PaymentMethod { get; set; } = "Cash";

    [MaxLength(100)]
    public string ReferenceNumber { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Notes { get; set; } = string.Empty;

    public DateTime? ExpenseDate { get; set; }
}