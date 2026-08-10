using System.ComponentModel.DataAnnotations;

namespace BarMaster.API.DTOs;

public class UpdateInventoryDto
{
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