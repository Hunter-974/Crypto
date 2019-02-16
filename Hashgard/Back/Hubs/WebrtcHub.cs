using Hashgard.Back.Hubs.Abstract;
using Hashgard.Back.Hubs.Helpers;
using Hashgard.Back.Models;
using Hashgard.Back.Requests;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hashgard.Back.Hubs
{
    public class WebrtcHub : Hub<IWebrtcHubClient>
    {
        private IDictionary<long, IDictionary<string, byte>> _listenerConnectionIds;


        public WebrtcHub()
        {
            _listenerConnectionIds = new ConcurrentDictionary<long, IDictionary<string, byte>>();
        }

        public Task Listen(long categoryId)
        {
            IDictionary<string, byte> connectionIdSet = new ConcurrentDictionary<string, byte>();
            if (!_listenerConnectionIds.TryAdd(categoryId, connectionIdSet))
            {
                connectionIdSet = _listenerConnectionIds[categoryId];
            }

            connectionIdSet.TryAdd(Context.ConnectionId, default(byte));

            return Task.CompletedTask;
        }

        public Task StopListening(long categoryId)
        {
            if (_listenerConnectionIds.TryGetValue(categoryId, out var connectionIdSet))
            {
                connectionIdSet.Remove(Context.ConnectionId);
            }

            return Task.CompletedTask;
        }

        public async Task Offer(long categoryId, User user, string offer)
        {
            if (_listenerConnectionIds.TryGetValue(categoryId, out var connectionIdSet))
            {
                var listeners = Clients.Clients(connectionIdSet.Select(kvp => kvp.Key).ToArray());
                await listeners.Offer(user, offer);
            }
        }

        public async Task Answer(long categoryId, User user, string answer)
        {
            if (_listenerConnectionIds.TryGetValue(categoryId, out var connectionIdSet))
            {
                var listeners = Clients.Clients(connectionIdSet.Select(kvp => kvp.Key).ToArray());
                await listeners.Answer(user, answer);
            }
        }
    }

    public interface IWebrtcHubClient
    {
        Task Offer(User user, string offer);
        Task Answer(User user, string answer);
    }
}
