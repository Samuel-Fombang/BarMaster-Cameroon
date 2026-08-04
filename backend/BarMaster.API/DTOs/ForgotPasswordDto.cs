using System.ComponentModel.DataAnnotations;

namespace BarMaster.API.DTOs;

public class ForgotPasswordDto
{
    [Required(ErrorMessage = "Email address is required.")]
    [EmailAddress(ErrorMessage = "Enter a valid email address.")]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;
}