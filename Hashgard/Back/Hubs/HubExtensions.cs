using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Hashgard.Back.Utils;

namespace Hashgard.Back.Hubs
{
    public static class HubExtensions
    {
        public static T Others<T>(this IHubClients<T> hubClients) where T : class, IBaseHubClient
        {
            T result;

            var httpContext = StaticInjector.Get<IHttpContextAccessor>().HttpContext;
            if (httpContext.TryGetHubsToken(out var hubsToken))
            {
                var excludedIds = StaticInjector.Get<IHubConnectionManager>().GetCurrent(hubsToken);
                result = hubClients.AllExcept(excludedIds);
            }
            else
            {
                result = hubClients.All;
            }
            return result;
        }

        
    }
}
