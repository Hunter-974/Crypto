using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;
using Crypto.Back.Utils;

namespace Crypto.Back.Hubs
{
    public abstract class BaseHub<T> : Hub<T> where T : class, IBaseHubClient
    {
        public static IHubConnectionManager ConnectionManager { get; private set; }

        public BaseHub(IHubConnectionManager connectionManager)
        {
            if (ConnectionManager == null)
            {
                ConnectionManager = connectionManager;
            }
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await base.OnDisconnectedAsync(exception);

            if (Context.GetHttpContext().TryGetHubsToken(out var appToken))
            {
                ConnectionManager.Remove(Context.ConnectionId);
            }
        }

        public Guid GetToken()
        {
            var token = Guid.NewGuid();
            ConnectionManager.Add(token, Context.ConnectionId);
            return token;
        }
    }

    public interface IBaseHubClient
    {
        Task SetAppToken(Guid appToken);
    }
}
