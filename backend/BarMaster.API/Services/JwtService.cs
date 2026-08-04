using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BarMaster.API.Models;
using BarMaster.API.Settings;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace BarMaster.API.Services;

public class JwtService
{
    private readonly JwtSettings _settings;

    public JwtService(
        IOptions<JwtSettings> settings
    )
    {
        _settings = settings.Value;
    }

    public (string Token, DateTime ExpiresAt)
        GenerateToken(Worker worker)
    {
        if (string.IsNullOrWhiteSpace(_settings.SecretKey))
        {
            throw new InvalidOperationException(
                "JWT SecretKey is not configured."
            );
        }

        if (_settings.SecretKey.Length < 32)
        {
            throw new InvalidOperationException(
                "JWT SecretKey must contain at least 32 characters."
            );
        }

        var expiresAt = DateTime.UtcNow.AddMinutes(
            _settings.ExpirationMinutes
        );

        var claims = new List<Claim>
        {
            new(
                JwtRegisteredClaimNames.Sub,
                worker.Id ?? string.Empty
            ),
            new(
                JwtRegisteredClaimNames.UniqueName,
                worker.Username
            ),
            new(
                JwtRegisteredClaimNames.Email,
                worker.Email
            ),
            new(
                JwtRegisteredClaimNames.Jti,
                Guid.NewGuid().ToString()
            ),
            new(
                ClaimTypes.NameIdentifier,
                worker.Id ?? string.Empty
            ),
            new(
                ClaimTypes.Name,
                $"{worker.FirstName} {worker.LastName}"
            ),
            new(
                ClaimTypes.Email,
                worker.Email
            ),
            new(
                ClaimTypes.Role,
                worker.Role
            ),
            new(
                "workerNumber",
                worker.WorkerNumber
            ),
            new(
                "username",
                worker.Username
            )
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(
                _settings.SecretKey
            )
        );

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256
        );

        var token = new JwtSecurityToken(
            issuer: _settings.Issuer,
            audience: _settings.Audience,
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: expiresAt,
            signingCredentials: credentials
        );

        var tokenValue =
            new JwtSecurityTokenHandler()
                .WriteToken(token);

        return (tokenValue, expiresAt);
    }
}