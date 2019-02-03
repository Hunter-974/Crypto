using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Crypto.Back.Hubs
{
    public interface IHubConnectionManager
    {
        void Add(Guid appToken, string connectionId);
        void Remove(string connectioniId);
        IReadOnlyList<string> GetCurrent(Guid appToken);
    }

    public class HubConnectionManager : IHubConnectionManager
    {
        private IDictionary<Guid, HashSet<string>> _connections;

        public HubConnectionManager()
        {
            _connections = new ConcurrentDictionary<Guid, HashSet<string>>();
        }

        public void Add(Guid appToken, string connectionId)
        {
            HashSet<string> connectionIdSet;

            if (!_connections.TryGetValue(appToken, out connectionIdSet))
            {
                connectionIdSet = new HashSet<string>();
                _connections.Add(appToken, connectionIdSet);
            }

            connectionIdSet.Add(connectionId);
        }

        public void Remove(string connectionId)
        {
            var connectionIdSets = _connections.Where(kvp => kvp.Value.Contains(connectionId));
            
            foreach (var connectionIdSet in connectionIdSets)
            {
                connectionIdSet.Value.Remove(connectionId);
            }
        }

        public IReadOnlyList<string> GetCurrent(Guid appToken)
        {
            HashSet<string> result;

            if (!_connections.TryGetValue(appToken, out result))
            {
                result = new HashSet<string>();
            }

            return result.ToList().AsReadOnly();
        }
    }
}
