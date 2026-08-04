using System.ComponentModel.DataAnnotations;

namespace BarMaster.API.DTOs;

public class UpdatePurchaseDto
{
    [MaxLength(100)]
    public string InvoiceNumber { get; set; } = string.Empty;

    [Required]
    [RegularExpression(
        "^(Paid|Partial|Unpaid)$",
        ErrorMessage = "Payment status must be Paid, Partial or Unpaid."
    )]
    public string PaymentStatus { get; set; } = "Paid";

    [MaxLength(500)]
    public string Notes { get; set; } = string.Empty;
}