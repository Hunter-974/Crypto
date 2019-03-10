using Hashgard.Back.Hubs.Abstract;
using Hashgard.Back.Models;
using Hashgard.Back.Services;
using System;
using System.Threading.Tasks;

namespace Hashgard.Back.Hubs
{
    public class ChatHub : BaseHub<IChatHubClient>
    {
        private readonly IChatService _chatService;

        public ChatHub(IChatService chatService, IUserService userService)
            : base(userService, "Chat")
        {
            _chatService = chatService;
        }

        protected override Task AfterListenAsync(User user, string groupName, string connectionId)
        {
            return Clients.OthersInGroup(groupName).UserJoined(user);
        }
        

        public Task PostMessage(string tokenString, int categoryId, string text)
        {
            return ForLoggedUser(tokenString, async user =>
            {
                var message = await _chatService.PostMessageAsync(categoryId, text, user.Id);
                await Clients.OthersInGroup(GetGroupName(categoryId)).NewMessage(message);
            });
        }

        public Task PostEvent(string tokenString, int categoryId, ChatEventType eventType, string text)
        {
            return ForLoggedUser(tokenString, async user =>
            {
                var message = await _chatService.PostEventAsync(categoryId, eventType, user.Id);
                await Clients.OthersInGroup(GetGroupName(categoryId)).NewMessage(message);
            });
        }

        public Task ViewMessage(string tokenString, int messageId)
        {
            return ForLoggedUser(tokenString, async user =>
            {
                var view = await _chatService.ViewAsync(messageId, user.Id);
                await Clients.OthersInGroup(GetGroupName(view.ChatMessage.CategoryId)).MessageViewed(view);
            });
        }
    }

    public interface IChatHubClient : IHubClient
    {
        Task UserJoined(User user);
        Task NewMessage(ChatMessage message);
        Task MessageViewed(ChatView view);
    }
}
