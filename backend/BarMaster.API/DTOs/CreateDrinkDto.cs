using System.ComponentModel.DataAnnotations;

namespace BarMaster.API.DTOs;

public class CreateDrinkDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Category { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Brand { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string BottleSize { get; set; } = string.Empty;

    [Range(0, 100000)]
    public decimal BuyingPrice { get; set; }

    [Range(0, 100000)]
    public decimal SellingPrice { get; set; }

    [Range(0, 100000)]
    public int CurrentStock { get; set; }

    [Range(0, 100000)]
    public int MinimumStock { get; set; }

    [MaxLength(100)]
    public string Supplier { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;
}