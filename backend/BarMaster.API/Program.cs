using BarMaster.API.Data;
using BarMaster.API.Settings;

var builder = WebApplication.CreateBuilder(args);

// Read MongoDB settings from appsettings.json
builder.Services.Configure<DatabaseSettings>(
    builder.Configuration.GetSection("MongoDbSettings")
);

// Register MongoDB Context
builder.Services.AddSingleton<MongoDbContext>();

// Add Controllers
builder.Services.AddControllers();

// Configure CORS for React Frontend
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

// OpenAPI (Swagger)
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure HTTP Request Pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Enable CORS
app.UseCors("AllowReactApp");

// Enable Controllers
app.MapControllers();

// Test Endpoint
app.MapGet("/", () => Results.Ok(new
{
    Application = "BarMaster Cameroon API",
    Version = "1.0",
    Status = "Running"
}));

app.Run();