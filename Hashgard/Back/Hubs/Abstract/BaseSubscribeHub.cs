using Hashgard.Back.Hubs.Helpers;
using Hashgard.Back.Requests;

namespace Hashgard.Back.Hubs.Abstract
{
    public abstract class BaseSubscribeHub<T> : BaseHub<T> where T : class, IBaseSubscribeHubClient
    {
        public BaseSubscribeHub(IHubConnectionManager connectionManager) 
            : base(connectionManager)
        {
        }

        public abstract void Subscribe(SubscribeRequest request);
    }

    public interface IBaseSubscribeHubClient : IBaseHubClient
    {
    }
}
