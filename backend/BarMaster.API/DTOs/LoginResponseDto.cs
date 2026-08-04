namespace BarMaster.API.DTOs;

public class LoginResponseDto
{
    public string Token { get; set; } = string.Empty;

    public string TokenType { get; set; } = "Bearer";

    public DateTime ExpiresAt { get; set; }

    public WorkerResponseDto Worker { get; set; } = new();
}