using Hashgard.Back.Models.Abstract;
using Newtonsoft.Json;
using System;

namespace Hashgard.Back.Models
{
    public class ChatView : Entity
    {
        private long messageId;

        public ChatView(long chatMessageId, long userId)
        {
            ChatMessageId = messageId;
            UserId = userId;
        }

        public long ChatMessageId { get; set; }

        [JsonIgnore]
        public virtual ChatMessage ChatMessage { get; set; }

        public long UserId { get; set; }

        public virtual User User { get; set; }

        public DateTime ViewedDateTime { get; set; }
    }
}
