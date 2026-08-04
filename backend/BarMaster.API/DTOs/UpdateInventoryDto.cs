using System.ComponentModel.DataAnnotations;

namespace BarMaster.API.DTOs;

public class UpdateInventoryDto
{
    [Range(0, 1000000)]
    public int Quantity { get; set; }

    [Range(0, 1000000)]
    public int MinimumQuantity { get; set; }

    public bool IsActive { get; set; } = true;
}