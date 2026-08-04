using System.ComponentModel.DataAnnotations;

namespace BarMaster.API.DTOs;

public class VerifyResetCodeDto
{
    [Required(ErrorMessage = "Email address is required.")]
    [EmailAddress(ErrorMessage = "Enter a valid email address.")]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Verification code is required.")]
    [RegularExpression(
        @"^\d{6}$",
        ErrorMessage = "The verification code must contain exactly 6 digits."
    )]
    public string Code { get; set; } = string.Empty;
}