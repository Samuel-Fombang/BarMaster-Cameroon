using System.ComponentModel.DataAnnotations;

namespace BarMaster.API.DTOs;

public class CreatePurchaseDto
{
    [Required]
    public string SupplierId { get; set; } = string.Empty;

    [Required]
    public string DestinationLocationId { get; set; } = string.Empty;

    [Required]
    public string DrinkId { get; set; } = string.Empty;

    [Range(1, 1000000)]
    public int Quantity { get; set; }

    [Range(0, 1000000000)]
    public decimal UnitBuyingPrice { get; set; }

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

    public DateTime? PurchaseDate { get; set; }
}