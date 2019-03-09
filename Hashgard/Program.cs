using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using System.Linq;
using System.Text.RegularExpressions;

namespace Hashgard
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args)
        {
            var builder = WebHost.CreateDefaultBuilder(args)
                .UseKestrel()
                .UseIISIntegration()
                .UseStartup<Startup>();

            builder.ConfigureAppConfiguration(
                (webBuilder, configBuilder) => configBuilder.AddJsonFile("./connectionStrings.json"));

            if (args.Any())
            {
                var portRegex = new Regex(@"^--port=(\d+)");
                foreach (var arg in args)
                {
                    var match = portRegex.Match(arg);
                    if (match.Success)
                    {
                        var port = int.Parse(match.Groups[1].Value);
                        builder.UseUrls($"http://*:{port}");
                    }
                }
            }

            return builder;
        }
    }
}
