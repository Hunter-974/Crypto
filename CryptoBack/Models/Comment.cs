using CryptoBack.Models.Abstract;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace CryptoBack.Models
{
    public class Comment : VersionedEntity, IComposite<Comment>
    {
        [ForeignKey("User.Id")]
        public long UserId { get; set; }

        [ForeignKey("Article.Id")]
        public long? ArticleId { get; set; }

        [ForeignKey("Comment.Id")]
        public long? CommentId { get; set; }


        public virtual User User { get; set; }

        public virtual Article Article { get; set; }

        public virtual Comment Parent { get; set; }

        public virtual IList<Comment> Children { get; set; }

        public virtual IList<Reaction> Reactions { get; set; }


        public string Text { get; set; }


        [NotMapped]
        public IList<ReactionCount> ReactionCounts { get; set; }
    }
}
