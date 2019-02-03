using System;
using Microsoft.Extensions.DependencyInjection;

namespace Hashgard.Back.Utils
{
    public static class StaticInjector
    {
        private static IServiceProvider _serviceProvider;

        public static T Get<T>()
        {
            if (_serviceProvider == null)
            {
                throw new InvalidOperationException("StaticInjector not configured. Call ServiceCollection.AddStaticInjector() in Startup.");
            }

            return _serviceProvider.GetService<T>();
        }

        public static void AddStaticInjector(this IServiceCollection serviceCollection)
        {
            _serviceProvider = serviceCollection.BuildServiceProvider();
        }
    }
}
