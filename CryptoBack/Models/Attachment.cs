using CryptoBack.Models.Abstract;
using System.ComponentModel.DataAnnotations.Schema;

namespace CryptoBack.Models
{
    public class Attachment : Entity
    {
        [ForeignKey("Article.Id")]
        public long? ArticleId { get; set; }

        [ForeignKey("Comment.Id")]
        public long? CommentId { get; set; }


        public virtual Article Article { get; set; }

        public virtual Comment Comment { get; set; }


        public byte[] Title { get; set; }

        public byte[] Data { get; set; }
    }
}
