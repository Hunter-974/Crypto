using Crypto.Back.Models.Abstract;
using System.ComponentModel.DataAnnotations.Schema;

namespace Crypto.Back.Models
{
    public class Attachment : Entity
    {
        [ForeignKey("Article.Id")]
        public long? ArticleId { get; set; }

        [ForeignKey("Comment.Id")]
        public long? CommentId { get; set; }


        public virtual Article Article { get; set; }

        public virtual Comment Comment { get; set; }


        public string Title { get; set; }

        public string Data { get; set; }
    }
}
