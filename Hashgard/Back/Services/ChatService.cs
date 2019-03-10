using Hashgard.Back.Db;
using Hashgard.Back.Models;
using Hashgard.Back.Models.Abstract;
using Hashgard.Back.Services.Abstract;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Hashgard.Back.Services
{
    public interface IChatService
    {
        Page<ChatMessage> GetList(long categoryId, int pageIndex, int count);
        Task<ChatMessage> PostMessageAsync(long categoryId, string text, long userId);
        Task<ChatMessage> PostEventAsync(long categoryId, ChatEventType eventType, long userId);
        Task<ChatView> ViewAsync(long messageId, long userId);
    }

    public class ChatService : BaseService, IChatService
    {
        public ChatService(HashgardContext context) : base(context)
        {
        }

        public Page<ChatMessage> GetList(long categoryId, int pageIndex, int count)
        {
            var result = HashgardContext.ChatMessages
                .Where(cm => cm.CategoryId == categoryId)
                .Include(cm => cm.User)
                .Include(cm => cm.Views).ThenInclude(v => v.User)
                .ToPage(pageIndex, count, cm => cm.SentDateTime, OrderBy.Desc);

            return result;
        }

        public async Task<ChatMessage> PostEventAsync(long categoryId, ChatEventType eventType, long userId)
        {
            var message = new ChatMessage(categoryId, eventType, userId);
            HashgardContext.Add(message);

            await HashgardContext.SaveChangesAsync();

            return message;
        }

        public async Task<ChatMessage> PostMessageAsync(long categoryId, string text, long userId)
        {
            var message = new ChatMessage(categoryId, text, userId);
            HashgardContext.Add(message);

            await HashgardContext.SaveChangesAsync();

            return message;
        }

        public async Task<ChatView> ViewAsync(long messageId, long userId)
        {
            var message = HashgardContext.ChatMessages
                .Include(cm => cm.Views)
                .ForId(messageId);

            if (message == null)
            {
                throw new Exception("Message not found");
            }

            var view = message.Views
                .SingleOrDefault(v => v.UserId == userId);

            if (view == null)
            {
                view = new ChatView(messageId, userId);
                HashgardContext.ChatMessageViews.Add(view);
                await HashgardContext.SaveChangesAsync();
            }

            return view;
        }
    }
}
