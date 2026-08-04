using System.ComponentModel.DataAnnotations;

namespace BarMaster.API.DTOs;

public class UpdateSaleDto
{
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
}