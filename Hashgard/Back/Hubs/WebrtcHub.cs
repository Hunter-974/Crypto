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
        private static IDictionary<long, IDictionary<string, byte>> _listenerConnectionIds
            = new ConcurrentDictionary<long, IDictionary<string, byte>>();

        public WebrtcHub()
        {
        }

        private string GetGroupName(long categoryId) => $"Live_{categoryId}";


        public async Task Listen(long categoryId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, GetGroupName(categoryId));
        }

        public async Task Offer(long categoryId, User user, string offer)
        {
            await Clients.OthersInGroup(GetGroupName(categoryId)).Offer(user, offer, Context.ConnectionId);
        }

        public async Task Answer(long categoryId, User user, string answer, string senderCid)
        {
           await Clients.Client(senderCid).Answer(user, answer);
        }

        public async Task IceCandidate(long categoryId, User user, string iceCandidate)
        {
            await Clients.OthersInGroup(GetGroupName(categoryId)).IceCandidateReceived(user, iceCandidate);
        }
    }

    public interface IWebrtcHubClient
    {
        Task Offer(User user, string offer, string senderCid);
        Task Answer(User user, string answer);
        Task IceCandidateReceived(User user, string iceCandidate);
    }
}
