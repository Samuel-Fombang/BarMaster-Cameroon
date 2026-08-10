using System.ComponentModel.DataAnnotations;

namespace BarMaster.API.DTOs;

public class CreateInventoryDto
{
    [Required]
    public string DrinkId { get; set; } = string.Empty;

    [Required]
    public string LocationId { get; set; } = string.Empty;

    [Range(0, 1000000)]
    public int Quantity { get; set; }

    [Range(0, 1000000)]
    public int MinimumQuantity { get; set; }

    [Range(
        typeof(decimal),
        "0",
        "999999999999",
        ErrorMessage = "Price per bottle cannot be negative."
    )]
    public decimal PricePerBottle { get; set; }

    public bool IsActive { get; set; } = true;
}