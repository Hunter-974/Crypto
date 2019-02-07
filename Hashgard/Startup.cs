using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Hashgard.Back.Services;
using Hashgard.Back.Db;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Hashgard.Back.Hubs;
using Hashgard.Back.Utils;
using Hashgard.Back.Hubs.Helpers;

namespace Hashgard
{
    public class Startup
    { 
        public static IHttpContextAccessor HttpContextAccessor { get; private set; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSignalR();
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            services.AddEntityFrameworkSqlite();

            var mssqlserverConnectionString = Configuration.GetConnectionString("mssqlserver");
            var sqliteConnectionString = Configuration.GetConnectionString("sqlite");

            if (!string.IsNullOrEmpty(mssqlserverConnectionString))
            {
                services.AddDbContext<HashgardContext>(options => options.UseSqlServer(mssqlserverConnectionString));
            }
            else if (!string.IsNullOrEmpty(sqliteConnectionString))
            {
                services.AddDbContext<HashgardContext>(options => options.UseSqlite(sqliteConnectionString));
            }
            else
            {
                throw new System.Exception("connection string not found");
            }
            
            services.AddHttpContextAccessor();

            services.AddSingleton<IHubConnectionManager, HubConnectionManager>();

            services.AddScoped<IArticleService, ArticleService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<ICommentService, CommentService>();
            services.AddScoped<IReactionService, ReactionService>();
            services.AddScoped<IUserService, UserService>();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            using (var serviceScope = app.ApplicationServices
                .GetRequiredService<IServiceScopeFactory>()
                .CreateScope())
            {
                using (var context = serviceScope.ServiceProvider.GetRequiredService<HashgardContext>())
                {
                    context.Database.Migrate();
                }
            }

            if (env.IsDevelopment())
            {
                app.UseCors(policy => policy
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowAnyOrigin()
                    .AllowCredentials());
                app.UseDeveloperExceptionPage();
            }

            var signalrPrefix = "/notif";
            app.UseSignalR(routes =>
            {
                routes.MapHub<ReactionHub>($"{signalrPrefix}/reaction");
            });

            app.UseMvc();
            app.UseDefaultFiles();
            app.UseStaticFiles();

            var letsEncryptPath = Configuration.GetValue<string>("LetsEncryptPath");
            if (!string.IsNullOrEmpty(letsEncryptPath))
            {
                app.Map(letsEncryptPath, app2 => app2.Run(async context =>
                {
                    var filePath = context.Request.PathBase.Add(context.Request.Path).Value.Trim('/');
                    await context.Response.SendFileAsync(filePath);
                }));
            }

            app.ApplicationServices.ConfigureStaticInjector();
        }
    }
}
