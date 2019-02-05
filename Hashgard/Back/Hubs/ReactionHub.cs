using Hashgard.Back.Hubs.Abstract;
using Hashgard.Back.Hubs.Helpers;
using Hashgard.Back.Models;
using Hashgard.Back.Requests;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hashgard.Back.Hubs
{
    public class ReactionHub : BaseSubscribeHub<IReactionHubClient>
    {
        public ReactionHub(IHubConnectionManager connectionManager) 
            : base(connectionManager)
        {
        }

        public override void Subscribe(SubscribeRequest request)
        {
            ConnectionManager.AddSubscription(request.ObjectType, request.ObjectId, Context.ConnectionId);
        }
    }

    public interface IReactionHubClient : IBaseSubscribeHubClient
    {
        Task Changed(ReactionType reactionType);
    }
}
