namespace BarMaster.API.Settings;

public class EmailSettings
{
    public string SmtpServer { get; set; } = "smtp.gmail.com";

    public int SmtpPort { get; set; } = 587;

    public string SenderName { get; set; } =
        "BarMaster Cameroon";

    public string SenderEmail { get; set; } = string.Empty;

    public string Username { get; set; } = string.Empty;

    public string AppPassword { get; set; } = string.Empty;

    public bool UseSsl { get; set; } = true;
}