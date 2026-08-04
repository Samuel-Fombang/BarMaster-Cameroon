using System.ComponentModel.DataAnnotations;

namespace BarMaster.API.DTOs;

public class CreateLocationDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [RegularExpression(
        "^(Warehouse|SalesArea|DamagedStock)$",
        ErrorMessage = "Type must be Warehouse, SalesArea or DamagedStock."
    )]
    public string Type { get; set; } = string.Empty;

    [MaxLength(250)]
    public string Address { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;
}