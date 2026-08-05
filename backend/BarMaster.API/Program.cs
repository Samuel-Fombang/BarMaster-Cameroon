using System.Text;
using BarMaster.API.Data;
using BarMaster.API.Data.Seed;
using BarMaster.API.Repositories;
using BarMaster.API.Services;
using BarMaster.API.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<DatabaseSettings>(
    builder.Configuration.GetSection("MongoDbSettings")
);

builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("JwtSettings")
);

builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection("EmailSettings")
);

builder.Services.AddSingleton<MongoDbContext>();

builder.Services.AddScoped<DrinkRepository>();
builder.Services.AddScoped<DrinkService>();
builder.Services.AddScoped<DrinkSeedService>();

builder.Services.AddScoped<CategoryRepository>();
builder.Services.AddScoped<CategoryService>();

builder.Services.AddScoped<BrandRepository>();
builder.Services.AddScoped<BrandService>();

builder.Services.AddScoped<BottleSizeRepository>();
builder.Services.AddScoped<BottleSizeService>();

builder.Services.AddScoped<SupplierRepository>();
builder.Services.AddScoped<SupplierService>();

builder.Services.AddScoped<StockRepository>();
builder.Services.AddScoped<StockService>();

builder.Services.AddScoped<LocationRepository>();
builder.Services.AddScoped<LocationService>();

builder.Services.AddScoped<InventoryRepository>();
builder.Services.AddScoped<InventoryService>();

builder.Services.AddScoped<TransferRepository>();
builder.Services.AddScoped<TransferService>();

builder.Services.AddScoped<PurchaseRepository>();
builder.Services.AddScoped<PurchaseService>();

builder.Services.AddScoped<SaleRepository>();
builder.Services.AddScoped<SaleService>();

builder.Services.AddScoped<ExpenseRepository>();
builder.Services.AddScoped<ExpenseService>();

builder.Services.AddScoped<WorkerRepository>();
builder.Services.AddScoped<WorkerService>();

builder.Services.AddScoped<DashboardService>();

builder.Services.AddScoped<PasswordResetCodeRepository>();

builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<EmailService>();
builder.Services.AddScoped<AuthService>();

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var jwtSettings =
    builder.Configuration
        .GetSection("JwtSettings")
        .Get<JwtSettings>()
    ?? throw new InvalidOperationException(
        "JwtSettings are not configured."
    );

if (string.IsNullOrWhiteSpace(jwtSettings.SecretKey))
{
    throw new InvalidOperationException(
        "JwtSettings:SecretKey is required."
    );
}

if (jwtSettings.SecretKey.Length < 32)
{
    throw new InvalidOperationException(
        "JwtSettings:SecretKey must contain at least 32 characters."
    );
}

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme =
            JwtBearerDefaults.AuthenticationScheme;

        options.DefaultChallengeScheme =
            JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = jwtSettings.Issuer,

                ValidateAudience = true,
                ValidAudience = jwtSettings.Audience,

                ValidateLifetime = true,

                ValidateIssuerSigningKey = true,
                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(
                            jwtSettings.SecretKey
                        )
                    ),

                ClockSkew = TimeSpan.FromMinutes(1)
            };
    });

builder.Services.AddAuthorization();

builder.Services.AddOpenApi();

var app = builder.Build();

// OpenAPI is available in both Development and Production.
app.MapOpenApi();

// Seed drinks only when running locally in Development.
if (app.Environment.IsDevelopment())
{
    using var scope =
        app.Services.CreateScope();

    var drinkSeedService =
        scope.ServiceProvider
            .GetRequiredService<DrinkSeedService>();

    await drinkSeedService.SeedAsync();
}

app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/", () => Results.Ok(new
{
    Application = "BarMaster Cameroon API",
    Version = "1.0",
    Status = "Running"
}));

app.Run();