using CheckupServer.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
//services from IDenty to Core
builder.Services
    .AddIdentityApiEndpoints<AppUser>()
    .AddEntityFrameworkStores<AppDbContext>();
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DevDB")));
builder.Services.Configure<IdentityOptions>(options => {
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.User.RequireUniqueEmail = true;
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//var summaries = new[]
//{
//    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
//};

//app.MapGet("/weatherforecast", () =>
//{
//    var forecast = Enumerable.Range(1, 5).Select(index =>
//        new WeatherForecast
//        (
//            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
//            Random.Shared.Next(-20, 55),
//            summaries[Random.Shared.Next(summaries.Length)]
//        ))
//        .ToArray();
//    return forecast;
//})
//.WithName("GetWeatherForecast")
//.WithOpenApi();

app.MapPost("/api/signup", async (UserManager<AppUser> userManager,
    [FromBody] UserRegisterationModel userRegisterationModel) => {
        AppUser user = new AppUser()
        {
            UserName = userRegisterationModel.email,
            FirstName = userRegisterationModel.firstname,
            LastName = userRegisterationModel.lastname,
            Email = userRegisterationModel.email,
        };
        var result = await userManager.CreateAsync(user, userRegisterationModel.password);
        if(result.Succeeded)
            return Results.Ok(result);
        else
            return Results.BadRequest(result);
    });

app
    .MapGroup("/api")
    .MapIdentityApi<AppUser>();
app.Run();


public class UserRegisterationModel
{
    public string firstname { get; set; }
    public string lastname { get; set; } 
    public string email { get; set; }
    public string password { get; set; }
} 