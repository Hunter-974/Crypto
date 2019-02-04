using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;
using Hashgard.Back.Utils;

namespace Hashgard.Back.Hubs
{
    public abstract class BaseHub<T> : Hub<T> where T : class, IBaseHubClient
    {
        private readonly IHubConnectionManager _connectionManager;

        public BaseHub(IHubConnectionManager connectionManager)
        {
            _connectionManager = connectionManager;
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
                _connectionManager.Remove(Context.ConnectionId);
            }
        }

        public Guid GetToken()
        {
            var token = Guid.NewGuid();
            _connectionManager.Add(token, Context.ConnectionId);
            return token;
        }
    }

    public interface IBaseHubClient
    {
        Task SetAppToken(Guid appToken);
    }
}
