using System.ComponentModel.DataAnnotations;

namespace BarMaster.API.DTOs;

public class UpdateTransferDto
{
    [MaxLength(500)]
    public string Reason { get; set; } = string.Empty;

    [Required]
    [RegularExpression(
        "^(Completed|Cancelled)$",
        ErrorMessage = "Status must be Completed or Cancelled."
    )]
    public string Status { get; set; } = "Completed";
}