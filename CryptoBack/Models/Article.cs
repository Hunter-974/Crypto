using CryptoBack.Models.Abstract;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace CryptoBack.Models
{
    public class Article : VersionedEntity
    {
        [ForeignKey("User.Id")]
        public long UserId { get; set; }

        [ForeignKey("Category.Id")]
        public long CategoryId { get; set; }


        public virtual User User { get; set; }

        public virtual IList<Reaction> Reactions { get; set; }

        public virtual IList<Comment> Comments { get; set; }

        public virtual IList<Attachment> Attachments { get; set; }


        public byte[] Title { get; set; }

        public byte[] Text { get; set; }
    }
}
