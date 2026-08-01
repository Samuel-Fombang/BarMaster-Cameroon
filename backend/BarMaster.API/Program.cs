using BarMaster.API.Data;
using BarMaster.API.Repositories;
using BarMaster.API.Services;
using BarMaster.API.Settings;

var builder = WebApplication.CreateBuilder(args);

// Read MongoDB settings from appsettings.json
builder.Services.Configure<DatabaseSettings>(
    builder.Configuration.GetSection("MongoDbSettings")
);

// Register MongoDB context
builder.Services.AddSingleton<MongoDbContext>();

// Register repository and service
builder.Services.AddScoped<DrinkRepository>();
builder.Services.AddScoped<DrinkService>();

// Add controllers
builder.Services.AddControllers();

// Allow the React frontend to call the backend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Add OpenAPI support
builder.Services.AddOpenApi();

var app = builder.Build();

// Enable OpenAPI in development
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Enable CORS
app.UseCors("AllowReactApp");

// Enable controller routes
app.MapControllers();

// Test endpoint
app.MapGet("/", () => Results.Ok(new
{
    Application = "BarMaster Cameroon API",
    Version = "1.0",
    Status = "Running"
}));

app.Run();