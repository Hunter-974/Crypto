using Hashgard.Back.Models.Abstract;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hashgard.Back.Models
{
    public class Article : VersionedEntity, IReactionTypes
    {
        [ForeignKey("User.Id")]
        public long? UserId { get; set; }

        [ForeignKey("Category.Id")]
        public long CategoryId { get; set; }


        public virtual User User { get; set; }

        public virtual IList<ReactionType> ReactionTypes { get; set; }

        [JsonIgnore]
        public virtual IList<Comment> Comments { get; set; }

        [JsonIgnore]
        public virtual IList<Attachment> Attachments { get; set; }


        public string Title { get; set; }

        public string Text { get; set; }
    }
}
