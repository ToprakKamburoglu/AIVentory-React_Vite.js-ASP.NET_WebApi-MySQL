using AIVentory_backend.Data;
using AIVentory_backend.Helpers;
using AIVentory_backend.Services.Implementations;
using AIVentory_backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);


builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "AIVentory API", Version = "v1" });
});


var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));


builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("YourSuperSecretKeyThatIsAtLeast32CharactersLong123456789")),
            ValidateIssuer = false,
            ValidateAudience = false, 
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });


builder.Services.AddScoped<JwtHelper>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();


builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IStockService, StockService>();
builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IAIService, AIService>();
builder.Services.AddScoped<IReportService, ReportService>();


builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();


app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "AIVentory API v1");
});


app.UseStaticFiles();

var webRootPath = app.Environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
if (!Directory.Exists(webRootPath))
{
    Directory.CreateDirectory(webRootPath);
    app.Environment.WebRootPath = webRootPath;
}


var uploadsPath = Path.Combine(webRootPath, "uploads");
Directory.CreateDirectory(uploadsPath);
Directory.CreateDirectory(Path.Combine(uploadsPath, "products"));
Directory.CreateDirectory(Path.Combine(uploadsPath, "avatars"));
Directory.CreateDirectory(Path.Combine(uploadsPath, "documents"));

Console.WriteLine($"? wwwroot created at: {webRootPath}");


app.UseRouting();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();