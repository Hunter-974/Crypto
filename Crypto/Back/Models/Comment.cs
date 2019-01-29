using Crypto.Back.Models.Abstract;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Crypto.Back.Models
{
    public class Comment : VersionedEntity, IComposite<Comment>, IReactionTypes
    {
        [ForeignKey("User.Id")]
        public long? UserId { get; set; }

        [ForeignKey("Article.Id")]
        public long? ArticleId { get; set; }

        [Column("CommentId"), ForeignKey("Comment.Id")]
        public long? ParentId { get; set; }


        public virtual User User { get; set; }

        public virtual Article Article { get; set; }

        public virtual Comment Parent { get; set; }

        public virtual IList<Comment> Children { get; set; }

        public virtual IList<ReactionType> ReactionTypes { get; set; }


        public string Text { get; set; }
    }
}
