using System.ComponentModel.DataAnnotations;

namespace BarMaster.API.DTOs;

public class CreateTransferDto
{
    [Required]
    public string SourceLocationId { get; set; } = string.Empty;

    [Required]
    public string DestinationLocationId { get; set; } = string.Empty;

    [Required]
    public string DrinkId { get; set; } = string.Empty;

    [Range(1, 1000000)]
    public int Quantity { get; set; }

    [MaxLength(500)]
    public string Reason { get; set; } = string.Empty;

    public DateTime? TransferDate { get; set; }
}