using CryptoBack.Models.Abstract;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CryptoBack.Models
{
    public class Category : Entity, IComposite<Category>
    {
        [ForeignKey("Category.Id")]
        public long? CategoryId { get; set; }

        [ForeignKey("User.Id")]
        public long UserId { get; set; }


        public virtual User User { get; set; }

        public virtual Category Parent { get; set; }

        public virtual IList<Category> Children { get; set; }

        public virtual IList<Article> Articles { get; set; }


        [Required]
        public byte[] Name { get; set; }
    }
}
