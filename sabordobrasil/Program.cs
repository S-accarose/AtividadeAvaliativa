using sabordobrasil.Models; // deve ser Models, não Data
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();

builder.Services.AddDbContext<SabordobrasilContext>(options =>
    options
        .UseMySql(
            builder.Configuration.GetConnectionString("DefaultConnection"),
            ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
        )
        .EnableSensitiveDataLogging() // Mostra valores dos parâmetros nas queries (não use em produção)
        .LogTo(Console.WriteLine, LogLevel.Information) // Log detalhado no console
);

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();
app.MapControllers();

app.Run();