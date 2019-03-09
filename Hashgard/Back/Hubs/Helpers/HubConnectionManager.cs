using Hashgard.Back.Utils;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace Hashgard.Back.Hubs.Helpers
{
    public interface IHubConnectionManager
    {
        void Add(Guid appToken, string connectionId);
        IReadOnlyList<string> Get(Guid appToken);


        void AddSubscription(ObjectType objectType, long objectId, string connectionId);
        IReadOnlyList<string> GetForSubscription(ObjectType objectType, long objectId);

        void Disconnect(HttpContext context, string connectionId);
    }

    public class HubConnectionManager : IHubConnectionManager
    {
        private IDictionary<Guid, ISet<string>> _connections;

        private IDictionary<ObjectType, IDictionary<long, ISet<string>>>  _subscriptions;


        public HubConnectionManager()
        {
            _connections = new ConcurrentDictionary<Guid, ISet<string>>();
            _subscriptions = new ConcurrentDictionary<ObjectType, IDictionary<long, ISet<string>>>();
        }

        public void Add(Guid appToken, string connectionId)
        {
            ISet<string> connectionIdSet;

            if (!_connections.TryGetValue(appToken, out connectionIdSet))
            {
                connectionIdSet = new HashSet<string>();
                _connections.TryAdd(appToken, connectionIdSet);
            }

            connectionIdSet.Add(connectionId);
        }

        public IReadOnlyList<string> Get(Guid appToken)
        {
            if (!_connections.TryGetValue(appToken, out var result))
            {
                result = new HashSet<string>();
            }

            return result.ToList().AsReadOnly();
        }

        public void AddSubscription(ObjectType objectType, long objectId, string connectionId)
        {
            if (!_subscriptions.TryGetValue(objectType, out var connectionsById))
            {
                connectionsById = new ConcurrentDictionary<long, ISet<string>>();
                _subscriptions.TryAdd(objectType, connectionsById);
            }

            if (!connectionsById.TryGetValue(objectId, out var connections))
            {
                connections = new HashSet<string>();
                connectionsById.TryAdd(objectId, connections);
            }

            connections.Add(connectionId);
        }

        public IReadOnlyList<string> GetForSubscription(ObjectType objectType, long objectId)
        {
            if (!_subscriptions.TryGetValue(objectType, out var connectionsById)
                || !connectionsById.TryGetValue(objectId, out var result))
            {
                result = new HashSet<string>();
            }

            return result.ToList().AsReadOnly();
        }

        public void Disconnect(HttpContext context, string connectionId)
        {
            if (context.TryGetHubsToken(out var appToken))
            {
                var connectionIdSets = _connections.Where(kvp => kvp.Value.Contains(connectionId));

                foreach (var connectionIdSet in connectionIdSets)
                {
                    connectionIdSet.Value.Remove(connectionId);
                }
            }

            foreach (var objectTypeKvp in _subscriptions)
            {

                var containingSets = objectTypeKvp.Value
                    .Select(objectIdKvp => objectIdKvp.Value)
                    .Where(connections => connections.Contains(connectionId));

                foreach (var containingSet in containingSets)
                {
                    containingSet.Remove(connectionId);
                }
            }
            
        }
    }
}
