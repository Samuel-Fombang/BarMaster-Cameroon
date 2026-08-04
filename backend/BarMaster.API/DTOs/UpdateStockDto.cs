using System.ComponentModel.DataAnnotations;

namespace BarMaster.API.DTOs;

public class UpdateStockDto
{
    [Range(0, 1000000)]
    public int CurrentQuantity { get; set; }

    [Range(0, 1000000)]
    public int MinimumQuantity { get; set; }

    public bool IsActive { get; set; } = true;
}