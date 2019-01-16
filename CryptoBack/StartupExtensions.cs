using CryptoBack.Db;
using CryptoBack.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Reflection;


namespace CryptoBack
{
    public static class StartupExtensions
    {
        public static void UseCryptoBackServices(this IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseMvc();
        }


        public static void ConfigureCryptoBackServices(this IServiceCollection services, Action<DbContextOptionsBuilder> dbContextAction)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            services.ConfigureCryptoBackDependancyInjection(dbContextAction);
        }


        public static void ConfigureCryptoBackAsApplicationPart(
            this IServiceCollection services, Action<DbContextOptionsBuilder> dbContextAction)
        {
            Assembly assembly = typeof(Startup).GetTypeInfo().Assembly;
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2).AddApplicationPart(assembly);
            services.ConfigureCryptoBackDependancyInjection(dbContextAction);
        }

        private static void ConfigureCryptoBackDependancyInjection(
            this IServiceCollection services, Action<DbContextOptionsBuilder> dbContextAction)
        {
            services.AddDbContext<Context>(dbContextAction);

            services.AddScoped<IArticleService, ArticleService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<ICommentService, CommentService>();
            services.AddScoped<IReactionService, ReactionService>();
            services.AddScoped<IUserService, UserService>();
        }
    }
}
