using System.ComponentModel.DataAnnotations;

namespace BarMaster.API.DTOs;

public class UpdateBrandDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(250)]
    public string Description { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;
}