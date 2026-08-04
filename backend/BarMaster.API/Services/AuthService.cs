using System.Security.Cryptography;
using System.Text;
using BarMaster.API.DTOs;
using BarMaster.API.Models;
using BarMaster.API.Repositories;
using Microsoft.AspNetCore.Identity;

namespace BarMaster.API.Services;

public class AuthService
{
    private readonly WorkerRepository _workerRepository;
    private readonly PasswordResetCodeRepository
        _passwordResetCodeRepository;
    private readonly JwtService _jwtService;
    private readonly EmailService _emailService;
    private readonly PasswordHasher<Worker> _passwordHasher;

    public AuthService(
        WorkerRepository workerRepository,
        PasswordResetCodeRepository passwordResetCodeRepository,
        JwtService jwtService,
        EmailService emailService
    )
    {
        _workerRepository = workerRepository;
        _passwordResetCodeRepository =
            passwordResetCodeRepository;
        _jwtService = jwtService;
        _emailService = emailService;
        _passwordHasher = new PasswordHasher<Worker>();
    }

    public async Task<
        (bool Success, string Message, LoginResponseDto? Response)
    > LoginAsync(LoginDto dto)
    {
        var usernameOrEmail =
            dto.UsernameOrEmail.Trim();

        var worker =
            await _workerRepository
                .GetByUsernameOrEmailAsync(
                    usernameOrEmail
                );

        if (worker is null)
        {
            return (
                false,
                "Invalid username, email or password.",
                null
            );
        }

        if (!worker.IsActive)
        {
            return (
                false,
                "This worker account is inactive.",
                null
            );
        }

        if (string.IsNullOrWhiteSpace(worker.PasswordHash))
        {
            return (
                false,
                "This account does not have a valid password. Please reset the password.",
                null
            );
        }

        var passwordResult =
            _passwordHasher.VerifyHashedPassword(
                worker,
                worker.PasswordHash,
                dto.Password
            );

        if (
            passwordResult ==
            PasswordVerificationResult.Failed
        )
        {
            return (
                false,
                "Invalid username, email or password.",
                null
            );
        }

        if (
            passwordResult ==
            PasswordVerificationResult.SuccessRehashNeeded
        )
        {
            worker.PasswordHash =
                _passwordHasher.HashPassword(
                    worker,
                    dto.Password
                );

            worker.UpdatedAt = DateTime.UtcNow;

            await _workerRepository.UpdateAsync(
                worker.Id!,
                worker
            );
        }

        var tokenResult =
            _jwtService.GenerateToken(worker);

        var response = new LoginResponseDto
        {
            Token = tokenResult.Token,
            TokenType = "Bearer",
            ExpiresAt = tokenResult.ExpiresAt,
            Worker = ToWorkerResponseDto(worker)
        };

        return (
            true,
            "Login successful.",
            response
        );
    }

    public async Task<(bool Success, string Message)>
        ForgotPasswordAsync(ForgotPasswordDto dto)
    {
        var email = dto.Email.Trim().ToLower();

        var neutralMessage =
            "If an account exists for this email, a verification code has been sent.";

        var worker =
            await _workerRepository.GetByEmailAsync(email);

        if (
            worker is null ||
            !worker.IsActive
        )
        {
            return (
                true,
                neutralMessage
            );
        }

        await _passwordResetCodeRepository
            .DeleteExpiredAsync();

        await _passwordResetCodeRepository
            .DeleteActiveByEmailAsync(email);

        var verificationCode =
            RandomNumberGenerator
                .GetInt32(100000, 1000000)
                .ToString();

        var resetCode = new PasswordResetCode
        {
            WorkerId = worker.Id!,
            Email = email,
            CodeHash = HashValue(verificationCode),
            ExpiresAt =
                DateTime.UtcNow.AddMinutes(10),
            FailedAttempts = 0,
            IsVerified = false,
            VerifiedAt = null,
            ResetTokenHash = string.Empty,
            ResetTokenExpiresAt = null,
            IsUsed = false,
            UsedAt = null,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _passwordResetCodeRepository
            .CreateAsync(resetCode);

        try
        {
            await _emailService
                .SendPasswordResetCodeAsync(
                    worker.Email,
                    $"{worker.FirstName} {worker.LastName}",
                    verificationCode
                );
        }
        catch
        {
            return (
                false,
                "The password reset email could not be sent. Check the email configuration."
            );
        }

        return (
            true,
            neutralMessage
        );
    }

    public async Task<
        (
            bool Success,
            string Message,
            string? ResetToken
        )
    > VerifyResetCodeAsync(
        VerifyResetCodeDto dto
    )
    {
        var email = dto.Email.Trim().ToLower();

        var resetCode =
            await _passwordResetCodeRepository
                .GetLatestActiveByEmailAsync(email);

        if (resetCode is null)
        {
            return (
                false,
                "The verification code is invalid or has expired.",
                null
            );
        }

        if (resetCode.IsUsed)
        {
            return (
                false,
                "This verification code has already been used.",
                null
            );
        }

        if (resetCode.ExpiresAt < DateTime.UtcNow)
        {
            return (
                false,
                "The verification code has expired.",
                null
            );
        }

        if (resetCode.FailedAttempts >= 5)
        {
            return (
                false,
                "Too many incorrect attempts. Request a new verification code.",
                null
            );
        }

        var suppliedCodeHash =
            HashValue(dto.Code);

        if (
            !CryptographicOperations.FixedTimeEquals(
                Convert.FromHexString(
                    resetCode.CodeHash
                ),
                Convert.FromHexString(
                    suppliedCodeHash
                )
            )
        )
        {
            resetCode.FailedAttempts += 1;
            resetCode.UpdatedAt = DateTime.UtcNow;

            await _passwordResetCodeRepository
                .UpdateAsync(
                    resetCode.Id!,
                    resetCode
                );

            return (
                false,
                "The verification code is incorrect.",
                null
            );
        }

        var resetToken =
            Convert.ToHexString(
                RandomNumberGenerator.GetBytes(32)
            );

        resetCode.IsVerified = true;
        resetCode.VerifiedAt = DateTime.UtcNow;
        resetCode.ResetTokenHash =
            HashValue(resetToken);
        resetCode.ResetTokenExpiresAt =
            DateTime.UtcNow.AddMinutes(15);
        resetCode.UpdatedAt = DateTime.UtcNow;

        await _passwordResetCodeRepository
            .UpdateAsync(
                resetCode.Id!,
                resetCode
            );

        return (
            true,
            "Verification code confirmed.",
            resetToken
        );
    }

    public async Task<(bool Success, string Message)>
        ResetPasswordAsync(ResetPasswordDto dto)
    {
        var email = dto.Email.Trim().ToLower();

        var resetTokenHash =
            HashValue(dto.ResetToken);

        var resetCode =
            await _passwordResetCodeRepository
                .GetByResetTokenHashAsync(
                    email,
                    resetTokenHash
                );

        if (resetCode is null)
        {
            return (
                false,
                "The reset token is invalid."
            );
        }

        if (resetCode.IsUsed)
        {
            return (
                false,
                "The reset token has already been used."
            );
        }

        if (
            resetCode.ResetTokenExpiresAt is null ||
            resetCode.ResetTokenExpiresAt <
                DateTime.UtcNow
        )
        {
            return (
                false,
                "The reset token has expired."
            );
        }

        var worker =
            await _workerRepository.GetByIdAsync(
                resetCode.WorkerId
            );

        if (worker is null)
        {
            return (
                false,
                "Worker account not found."
            );
        }

        worker.PasswordHash =
            _passwordHasher.HashPassword(
                worker,
                dto.NewPassword
            );

        worker.UpdatedAt = DateTime.UtcNow;

        await _workerRepository.UpdateAsync(
            worker.Id!,
            worker
        );

        resetCode.IsUsed = true;
        resetCode.UsedAt = DateTime.UtcNow;
        resetCode.UpdatedAt = DateTime.UtcNow;

        await _passwordResetCodeRepository
            .UpdateAsync(
                resetCode.Id!,
                resetCode
            );

        return (
            true,
            "Password reset successfully."
        );
    }

    private static string HashValue(
        string value
    )
    {
        var bytes =
            SHA256.HashData(
                Encoding.UTF8.GetBytes(value)
            );

        return Convert.ToHexString(bytes);
    }

    private static WorkerResponseDto
        ToWorkerResponseDto(Worker worker)
    {
        return new WorkerResponseDto
        {
            Id = worker.Id,
            WorkerNumber = worker.WorkerNumber,
            FirstName = worker.FirstName,
            LastName = worker.LastName,
            Phone = worker.Phone,
            Email = worker.Email,
            Role = worker.Role,
            Username = worker.Username,
            IsActive = worker.IsActive,
            CreatedAt = worker.CreatedAt,
            UpdatedAt = worker.UpdatedAt
        };
    }
}