using Hashgard.Back.Models;
using Hashgard.Back.Services;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace Hashgard.Back.Hubs
{
    public class WebrtcHub : Hub<IWebrtcHubClient>
    {
        private readonly IUserService _userService;


        public WebrtcHub(IUserService userService)
        {
            _userService = userService;
        }


        private string GetGroupName(long categoryId) 
            => $"Live_{categoryId}";


        protected User GetLoggedUser(string tokenString)
        {
            User user = null;

            if (Guid.TryParse(tokenString, out var token))
            {
                user = _userService.GetAuthenticatedUser(token);
            }

            return user;
        }

        protected Task<T> ForLoggedUser<T>(string tokenString, Func<User, Task<T>> execute) where T : class, new()
        {
            var user = GetLoggedUser(tokenString);
            Task<T> entityTask;

            if (user == null)
            {
                try
                {
                    throw new Exception("Unauthorized");
                }
                catch (Exception ex)
                {
                    entityTask = Task.FromException<T>(ex);
                }
            }
            else
            {
                entityTask = execute(user);
            }

            return entityTask;
        }

        protected Task ForLoggedUser(string tokenString, Func<User, Task> execute)
        {
            var user = GetLoggedUser(tokenString);
            Task task;

            if (user == null)
            {
                try
                {
                    throw new Exception("Unauthorized");
                }
                catch (Exception ex)
                {
                    task = Task.FromException(ex);
                }
            }
            else
            {
                task = execute(user);
            }

            return task;
        }


        public Task Listen(string tokenString, long categoryId)
        {
            return ForLoggedUser(tokenString, async user =>
            {
                var groupName = GetGroupName(categoryId);
                var cid = Context.ConnectionId;
                await Groups.AddToGroupAsync(cid, groupName);
                await Clients.OthersInGroup(groupName).UserJoined(user, cid);
            });
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

    public interface IWebrtcHubClient
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
