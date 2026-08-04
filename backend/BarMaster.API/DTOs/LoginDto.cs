using System.ComponentModel.DataAnnotations;

namespace BarMaster.API.DTOs;

public class LoginDto
{
    [Required(ErrorMessage = "Username or email is required.")]
    [MaxLength(150)]
    public string UsernameOrEmail { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required.")]
    public string Password { get; set; } = string.Empty;
}