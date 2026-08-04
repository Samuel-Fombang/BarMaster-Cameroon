using BarMaster.API.DTOs;
using BarMaster.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace BarMaster.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login(
        LoginDto dto
    )
    {
        var result = await _authService.LoginAsync(dto);

        if (!result.Success || result.Response is null)
        {
            return Unauthorized(new
            {
                message = result.Message
            });
        }

        return Ok(result.Response);
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(
        ForgotPasswordDto dto
    )
    {
        var result =
            await _authService.ForgotPasswordAsync(dto);

        if (!result.Success)
        {
            return BadRequest(new
            {
                message = result.Message
            });
        }

        return Ok(new
        {
            message = result.Message
        });
    }

    [HttpPost("verify-reset-code")]
    public async Task<IActionResult> VerifyResetCode(
        VerifyResetCodeDto dto
    )
    {
        var result =
            await _authService.VerifyResetCodeAsync(dto);

        if (!result.Success || result.ResetToken is null)
        {
            return BadRequest(new
            {
                message = result.Message
            });
        }

        return Ok(new
        {
            message = result.Message,
            resetToken = result.ResetToken
        });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(
        ResetPasswordDto dto
    )
    {
        var result =
            await _authService.ResetPasswordAsync(dto);

        if (!result.Success)
        {
            return BadRequest(new
            {
                message = result.Message
            });
        }

        return Ok(new
        {
            message = result.Message
        });
    }
}