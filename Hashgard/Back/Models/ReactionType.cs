using Hashgard.Back.Models.Abstract;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace Hashgard.Back.Models
{
    public class ReactionType : Entity
    {
        [ForeignKey("Article.Id")]
        public long? ArticleId { get; set; }

        [ForeignKey("Comment.Id")]
        public long? CommentId { get; set; }


        [JsonIgnore]
        public virtual Article Article { get; set; }

        [JsonIgnore]
        public virtual Comment Comment { get; set; }

        [JsonIgnore]
        public virtual IList<Reaction> Reactions { get; set; }


        public string Name { get; set; }

        [NotMapped]
        public int ReactionCount => Reactions?.Count ?? 0;

        [NotMapped]
        public IEnumerable<long> ReactionUserIds
            => Reactions?.Select(r => r.UserId);
    }
}