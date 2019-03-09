using Hashgard.Back.Models.Abstract;
using System;

namespace Hashgard.Back.Models
{
    public class ChatMessageView : Entity
    {
        public long ChatMessageId { get; set; }

        public virtual ChatMessage ChatMessage { get; set; }

        public long UserId { get; set; }

        public virtual User User { get; set; }

        public DateTime ViewedDateTime { get; set; }
    }
}
