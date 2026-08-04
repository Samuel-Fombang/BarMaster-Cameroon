using BarMaster.API.Settings;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace BarMaster.API.Services;

public class EmailService
{
    private readonly EmailSettings _settings;
    private readonly ILogger<EmailService> _logger;

    public EmailService(
        IOptions<EmailSettings> settings,
        ILogger<EmailService> logger
    )
    {
        _settings = settings.Value;
        _logger = logger;
    }

    public async Task SendPasswordResetCodeAsync(
        string recipientEmail,
        string recipientName,
        string verificationCode
    )
    {
        ValidateSettings();

        var message = new MimeMessage();

        message.From.Add(
            new MailboxAddress(
                _settings.SenderName,
                _settings.SenderEmail
            )
        );

        message.To.Add(
            new MailboxAddress(
                recipientName,
                recipientEmail
            )
        );

        message.Subject =
            "Your BarMaster password reset code";

        var bodyBuilder = new BodyBuilder
        {
            TextBody =
                $"""
                Hello {recipientName},

                We received a request to reset your BarMaster password.

                Your verification code is:

                {verificationCode}

                This code expires in 10 minutes.

                If you did not request a password reset, you can ignore this email.

                BarMaster Cameroon
                """,

            HtmlBody =
                $"""
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                    >
                    <title>BarMaster Password Reset</title>
                </head>

                <body
                    style="
                        margin: 0;
                        padding: 24px;
                        background-color: #f3f4f6;
                        font-family: Arial, sans-serif;
                        color: #111827;
                    "
                >
                    <div
                        style="
                            max-width: 560px;
                            margin: 0 auto;
                            background-color: #ffffff;
                            border-radius: 12px;
                            padding: 32px;
                            box-shadow: 0 4px 16px rgba(0,0,0,0.08);
                        "
                    >
                        <h1
                            style="
                                margin-top: 0;
                                font-size: 26px;
                            "
                        >
                            BarMaster Cameroon
                        </h1>

                        <p>Hello {recipientName},</p>

                        <p>
                            We received a request to reset your
                            BarMaster password.
                        </p>

                        <p>Your six-digit verification code is:</p>

                        <div
                            style="
                                margin: 24px 0;
                                padding: 18px;
                                background-color: #111827;
                                color: #ffffff;
                                border-radius: 10px;
                                text-align: center;
                                font-size: 34px;
                                font-weight: bold;
                                letter-spacing: 8px;
                            "
                        >
                            {verificationCode}
                        </div>

                        <p>
                            This code expires in
                            <strong>10 minutes</strong>.
                        </p>

                        <p
                            style="
                                color: #6b7280;
                                font-size: 14px;
                            "
                        >
                            If you did not request a password reset,
                            you can safely ignore this email.
                        </p>
                    </div>
                </body>
                </html>
                """
        };

        message.Body = bodyBuilder.ToMessageBody();

        using var smtpClient = new SmtpClient();

        try
        {
            var socketOption =
                _settings.SmtpPort == 465
                    ? SecureSocketOptions.SslOnConnect
                    : SecureSocketOptions.StartTls;

            await smtpClient.ConnectAsync(
                _settings.SmtpServer,
                _settings.SmtpPort,
                socketOption
            );

            await smtpClient.AuthenticateAsync(
                _settings.Username,
                _settings.AppPassword
            );

            await smtpClient.SendAsync(message);

            await smtpClient.DisconnectAsync(true);
        }
        catch (Exception exception)
        {
            _logger.LogError(
                exception,
                "Could not send password reset email to {Email}.",
                recipientEmail
            );

            throw new InvalidOperationException(
                "The password reset email could not be sent.",
                exception
            );
        }
    }

    private void ValidateSettings()
    {
        if (string.IsNullOrWhiteSpace(_settings.SmtpServer))
        {
            throw new InvalidOperationException(
                "Email SMTP server is not configured."
            );
        }

        if (_settings.SmtpPort <= 0)
        {
            throw new InvalidOperationException(
                "Email SMTP port is not configured."
            );
        }

        if (string.IsNullOrWhiteSpace(_settings.SenderEmail))
        {
            throw new InvalidOperationException(
                "Email sender address is not configured."
            );
        }

        if (string.IsNullOrWhiteSpace(_settings.Username))
        {
            throw new InvalidOperationException(
                "Email username is not configured."
            );
        }

        if (string.IsNullOrWhiteSpace(_settings.AppPassword))
        {
            throw new InvalidOperationException(
                "Gmail App Password is not configured."
            );
        }
    }
}