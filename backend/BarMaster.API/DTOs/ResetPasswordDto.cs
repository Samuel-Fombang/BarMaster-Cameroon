using System.ComponentModel.DataAnnotations;

namespace BarMaster.API.DTOs;

public class ResetPasswordDto
{
    [Required(ErrorMessage = "Email address is required.")]
    [EmailAddress(ErrorMessage = "Enter a valid email address.")]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Reset token is required.")]
    public string ResetToken { get; set; } = string.Empty;

    [Required(ErrorMessage = "New password is required.")]
    [MinLength(
        8,
        ErrorMessage = "Password must contain at least 8 characters."
    )]
    public string NewPassword { get; set; } = string.Empty;

    [Required(ErrorMessage = "Please confirm the new password.")]
    [Compare(
        nameof(NewPassword),
        ErrorMessage = "The passwords do not match."
    )]
    public string ConfirmPassword { get; set; } = string.Empty;
}