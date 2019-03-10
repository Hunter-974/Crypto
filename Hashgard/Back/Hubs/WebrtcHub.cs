using Hashgard.Back.Hubs.Abstract;
using Hashgard.Back.Models;
using Hashgard.Back.Services;
using System.Threading.Tasks;

namespace Hashgard.Back.Hubs
{
    public class WebrtcHub : BaseHub<IWebrtcHubClient>
    {
        public WebrtcHub(IUserService userService)
            : base (userService, "Live")
        {
        }

        protected override Task AfterListenAsync(User user, string groupName, string connectionId)
        {
            return Clients.OthersInGroup(groupName).UserJoined(user, connectionId);
        }

        public Task Welcome(string tokenString, string toCid)
        {
            return ForLoggedUser(tokenString, user => 
                Clients.Client(toCid).Welcome(user, Context.ConnectionId));
        }

        public Task Offer(string tokenString, string toCid, string offer)
        {
            return ForLoggedUser(tokenString, user => 
                Clients.Client(toCid).Offer(offer, user, Context.ConnectionId));
        }

        public Task Answer(string tokenString, string toCid, string answer)
        {
            return ForLoggedUser(tokenString, user => 
                Clients.Client(toCid).Answer(answer, user, Context.ConnectionId));
        }

        public Task IceCandidate(string tokenString, string toCid, string direction, string iceCandidate)
        {
            var toDirection = direction == "in" ? "out" : "in";
            return ForLoggedUser(tokenString, user =>
                Clients.Client(toCid).IceCandidate(iceCandidate, user, Context.ConnectionId, toDirection));
        }
    }

    public interface IWebrtcHubClient : IHubClient
    {
        Task UserJoined(User user, string cid);
        Task Welcome(User user, string cid);
        Task Offer(string offer, User user, string cid);
        Task Answer(string answer, User user, string cid);
        Task IceCandidate(string iceCandidate, User user, string cid, string direction);
    }

    public enum IceCandidateDirection
    {
        In, Out
    }
}
