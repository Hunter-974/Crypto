using Crypto.Back.Models.Abstract;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Crypto.Back.Models
{
    public class Article : VersionedEntity, IReactionTypes
    {
        [ForeignKey("User.Id")]
        public long? UserId { get; set; }

        [ForeignKey("Category.Id")]
        public long CategoryId { get; set; }


        public virtual User User { get; set; }

        public virtual IList<ReactionType> ReactionTypes { get; set; }

        public virtual IList<Comment> Comments { get; set; }

        public virtual IList<Attachment> Attachments { get; set; }


        public string Title { get; set; }

        public string Text { get; set; }
    }
}
