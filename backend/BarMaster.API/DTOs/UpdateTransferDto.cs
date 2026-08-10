using System.ComponentModel.DataAnnotations;

namespace BarMaster.API.DTOs;

public class UpdateTransferDto
{
    [Required]
    public string SourceLocationId { get; set; } = string.Empty;

    [Required]
    public string DestinationLocationId { get; set; } = string.Empty;

    [Required]
    public string DrinkId { get; set; } = string.Empty;

    [Range(1, 1000000)]
    public int Quantity { get; set; }

    [Range(
        typeof(decimal),
        "0.01",
        "999999999999",
        ErrorMessage = "Price per bottle must be greater than zero."
    )]
    public decimal PricePerBottle { get; set; }

    [MaxLength(500)]
    public string Reason { get; set; } = string.Empty;

    [Required]
    [RegularExpression(
        "^(Completed|Cancelled)$",
        ErrorMessage = "Status must be Completed or Cancelled."
    )]
    public string Status { get; set; } = "Completed";

    public DateTime? TransferDate { get; set; }
}