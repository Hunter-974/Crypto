using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;

namespace CryptoFront
{
    public static class StartupExtensions
    {
        public static void UseCryptoFrontServices(this IApplicationBuilder app)
        {
            app.UseDefaultFiles();
            app.UseStaticFiles();
        }
    }
}
