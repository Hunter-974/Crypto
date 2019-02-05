using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Hashgard.Back.Utils;
using Hashgard.Back.Hubs.Abstract;
using System.Collections.Generic;
using System.Linq;
using System;

namespace Hashgard.Back.Hubs.Helpers
{
    public static class HubExtensions
    {
        public static T Others<T>(this IHubClients<T> hubClients) where T : class, IBaseHubClient
        {
            T result;

            var httpContext = StaticInjector.Get<IHttpContextAccessor>().HttpContext;
            if (httpContext.TryGetHubsToken(out var hubsToken))
            {
                var excludedIds = StaticInjector.Get<IHubConnectionManager>().Get(hubsToken);
                result = hubClients.AllExcept(excludedIds);
            }
            else
            {
                result = hubClients.All;
            }
            return result;
        }

        public static T OtherSubscribers<T>(this IHubClients<T> hubClients, ObjectType objectType, long objectId)
        {
            T result;
            var excludedIds = new List<string>();

            var httpContext = StaticInjector.Get<IHttpContextAccessor>().HttpContext;
            var connectionManager = StaticInjector.Get<IHubConnectionManager>();

            var subscribed = new List<string>(connectionManager.GetForSubscription(objectType, objectId));

            IEnumerable<string> currents = new string[0];
            if (httpContext.TryGetHubsToken(out var hubsToken))
            {
                currents = connectionManager.Get(hubsToken);
            }

            var clients = subscribed.Except(currents).ToList().AsReadOnly();
            result = hubClients.Clients(clients);

            return result;
        }

    }
}
