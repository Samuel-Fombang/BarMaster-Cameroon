namespace BarMaster.API.DTOs;

public class CreateBottleSizeDto
{
    public string Name { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;
}