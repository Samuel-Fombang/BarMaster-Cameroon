namespace BarMaster.API.Settings;

public class JwtSettings
{
    public string SecretKey { get; set; } = string.Empty;

    public string Issuer { get; set; } = "BarMaster.API";

    public string Audience { get; set; } = "BarMaster.Frontend";

    public int ExpirationMinutes { get; set; } = 480;
}