using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Diagnostics;
using Crypto.Back.Services;
using Crypto.Back.Db;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Crypto
{
  public class Startup
  {
    private Process _npmProcess;

    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    public void ConfigureServices(IServiceCollection services)
    {
      services.AddEntityFrameworkSqlite();
      var sqliteConnectionString = Configuration.GetConnectionString("sqlite");

      services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

      services.AddDbContext<Context>(options => options.UseSqlite(sqliteConnectionString));

      services.AddScoped<IArticleService, ArticleService>();
      services.AddScoped<ICategoryService, CategoryService>();
      services.AddScoped<ICommentService, CommentService>();
      services.AddScoped<IReactionService, ReactionService>();
      services.AddScoped<IUserService, UserService>();
    }

    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
      app.Use(async (context, next) =>
      {
        await next();
        if (context.Response.StatusCode == 404 &&
            !Path.HasExtension(context.Request.Path.Value) &&
            !context.Request.Path.Value.StartsWith("/api/"))
        {
          context.Request.Path = "/index.html";
          await next();
        }
      });

      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }

      app.UseMvc();
      app.UseDefaultFiles();
      app.UseStaticFiles();

      if (env.IsDevelopment())
      {
        try
        {
          _npmProcess = new Process
          {
            StartInfo = new ProcessStartInfo
            {
              FileName = "cmd.exe",
              Arguments = "/C npm start --prefix ./Front",
              UseShellExecute = false
            }
          };
          _npmProcess.Start();
        }
        catch (Exception ex)
        {
          Console.WriteLine(ex);
        }
      }

      var applicationLifetime = app.ApplicationServices.GetRequiredService<IApplicationLifetime>();
      applicationLifetime.ApplicationStopping.Register(OnShutDown);
    }

    private void OnShutDown()
    {
      if (_npmProcess != null)
      {
        try
        {
          Console.WriteLine($"Killing process npm process ( {_npmProcess.StartInfo.FileName} {_npmProcess.StartInfo.Arguments} )");
          _npmProcess.Kill();
        }
        catch (Exception ex)
        {
          Console.WriteLine($"Unable to Kill npm process ( {_npmProcess.StartInfo.FileName} {_npmProcess.StartInfo.Arguments} )");
          Console.WriteLine($"Exception: {ex}");
        }
      }
    }
  }
}
