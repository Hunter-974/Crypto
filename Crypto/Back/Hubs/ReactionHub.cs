using Crypto.Back.Models;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace Crypto.Back.Hubs
{
    public class ReactionHub : BaseHub<IReactionHubClient>
    {
        public ReactionHub(IHubConnectionManager connectionManager) 
            : base(connectionManager)
        {
        }
    }

    public interface IReactionHubClient : IBaseHubClient
    {
        Task Changed(ReactionType reactionType);
    }
}
