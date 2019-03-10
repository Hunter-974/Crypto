using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;
using Hashgard.Back.Services;
using Hashgard.Back.Models;
using System.Collections.Generic;
using System.Linq;

namespace Hashgard.Back.Hubs.Abstract
{
    public abstract class BaseHub<T> : Hub<T> where T : class, IHubClient
    {
        protected readonly IUserService _userService;
        protected readonly string _entityName;

        private static IDictionary<string, ISet<string>> _groupNamesByConnectionId
            = new Dictionary<string, ISet<string>>();

        
        public BaseHub(IUserService userService, string entityName)
        {
            _userService = userService;
            _entityName = entityName;
        }

        protected string GetGroupName(long entityId)
            => $"{_entityName}_{entityId}";

        protected IReadOnlyCollection<string> GetGroups(string connectionId)
        {
            IReadOnlyCollection<string> result = new string[0];

            if (_groupNamesByConnectionId.TryGetValue(connectionId, out var groups))
            {
                result = groups.ToList().AsReadOnly();
            }
            
            return result;
        }

        protected async Task AddToGroupAsync(string connectionId, string groupName)
        {
            ISet<string> groups = null;
            if (!_groupNamesByConnectionId.TryGetValue(connectionId, out groups))
            {
                groups = new HashSet<string>();
                _groupNamesByConnectionId.Add(connectionId, groups);
            }

            groups.Add(groupName);

            await Groups.AddToGroupAsync(connectionId, groupName);

        }

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


        public Task Listen(string tokenString, long entityId)
        {
            return ForLoggedUser(tokenString, async user =>
            {
                var cid = Context.ConnectionId;
                var groupName = GetGroupName(entityId);
                await AddToGroupAsync(cid, groupName);
                await AfterListenAsync(user, groupName, cid);
            });
        }

        protected virtual Task AfterListenAsync(User user, string groupName, string connectionId)
        {
            return Task.CompletedTask;
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await base.OnDisconnectedAsync(exception);
            _groupNamesByConnectionId.Remove(Context.ConnectionId);
        }
    }

    public interface IHubClient
    {
    }
}
