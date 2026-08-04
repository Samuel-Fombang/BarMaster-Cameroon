using System.ComponentModel.DataAnnotations;

namespace BarMaster.API.DTOs;

public class CreateSaleDto
{
    [Required]
    public string LocationId { get; set; } = string.Empty;

    [Required]
    public string DrinkId { get; set; } = string.Empty;

    [Range(
        1,
        1000000,
        ErrorMessage = "Quantity must be greater than zero."
    )]
    public int Quantity { get; set; }

    [Range(
        0,
        1000000000,
        ErrorMessage = "Selling price cannot be negative."
    )]
    public decimal UnitSellingPrice { get; set; }

    [Required]
    [RegularExpression(
        "^(Cash|MTN_MOMO|ORANGE_MONEY|Card|Credit)$",
        ErrorMessage =
            "Payment method must be Cash, MTN_MOMO, ORANGE_MONEY, Card or Credit."
    )]
    public string PaymentMethod { get; set; } = "Cash";

    [MaxLength(150)]
    public string CustomerName { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Notes { get; set; } = string.Empty;

    public DateTime? SaleDate { get; set; }
}