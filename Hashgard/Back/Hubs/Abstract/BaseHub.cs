using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;
using Hashgard.Back.Utils;
using Hashgard.Back.Hubs.Helpers;

namespace Hashgard.Back.Hubs.Abstract
{
    public abstract class BaseHub<T> : Hub<T> where T : class, IBaseHubClient
    {
        protected IHubConnectionManager ConnectionManager { get; }


        public BaseHub(IHubConnectionManager connectionManager)
        {
            ConnectionManager = connectionManager;
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await base.OnDisconnectedAsync(exception);

            ConnectionManager.Disconnect(Context.GetHttpContext(), Context.ConnectionId);
        }

        public Guid SyncToken(Guid? token)
        {
            var newToken = token.HasValue ? token.Value : Guid.NewGuid();
            ConnectionManager.Add(newToken, Context.ConnectionId);
            return newToken;
        }
    }

    public interface IBaseHubClient
    {
        Task SetAppToken(Guid appToken);
    }
}
