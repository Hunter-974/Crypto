using CryptoBack.Models.Abstract;
using System.ComponentModel.DataAnnotations.Schema;

namespace CryptoBack.Models
{
    public class Reaction : Entity
    {
        [ForeignKey("User.Id")]
        public long UserId { get; set; }

        [ForeignKey("Article.Id")]
        public long? ArticleId { get; set; }

        [ForeignKey("Comment.Id")]
        public long? CommentId { get; set; }


        public virtual User User { get; set; }

        public virtual Article Article { get; set; }

        public virtual Comment Comment { get; set; }


        public string ReactionType { get; set; }
    }
}
