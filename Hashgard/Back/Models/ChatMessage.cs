using Hashgard.Back.Models.Abstract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hashgard.Back.Models
{
    public class ChatMessage : Entity
    {
        public long CategoryId { get; set; }

        public long UserId { get; set; }

        public virtual User User { get; set; }

        public virtual IList<ChatMessageView> ChatMessageViewList { get; set; }

        public DateTime SentDateTime { get; set; }

        public string Text { get; set; }
    }
}
