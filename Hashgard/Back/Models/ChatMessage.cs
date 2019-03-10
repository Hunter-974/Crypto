using Hashgard.Back.Models.Abstract;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace Hashgard.Back.Models
{
    public class ChatMessage : Entity
    {
        public long CategoryId { get; set; }
        
        [JsonIgnore]
        public virtual Category Category { get; set; }

        public long? UserId { get; set; }

        public virtual User User { get; set; }

        public virtual IList<ChatView> Views { get; set; }

        public DateTime SentDateTime { get; set; }

        public ChatEventType? EventType { get; set; }

        public string Text { get; set; }

        public ChatMessage()
        {
        }

        public ChatMessage(long categoryId, long? userId = null)
        {
            UserId = userId;
            CategoryId = categoryId;
            SentDateTime = DateTime.Now;
        }

        public ChatMessage(long categoryId, string text, long? userId = null)
            : this(categoryId, userId)
        {
            Text = text;
        }

        public ChatMessage(long categoryId, ChatEventType eventType, long? userId = null, string text = null)
            : this(categoryId, text, userId)
        {
            EventType = EventType;
        }
    }

    public enum ChatEventType
    {
        Connected = 0,
        Disconnected = 1
    }
}
