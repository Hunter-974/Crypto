using Crypto.Back.Models.Abstract;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Crypto.Back.Models
{
    public class Category : Entity, IComposite<Category>
    {
        [Column("CategoryId"), ForeignKey("Category.Id")]
        public long? ParentId { get; set; }

        [ForeignKey("User.Id")]
        public long? UserId { get; set; }


        public virtual User User { get; set; }

        public virtual Category Parent { get; set; }

        public virtual IList<Category> Children { get; set; }

        public virtual IList<Article> Articles { get; set; }


        [Required]
        public string Name { get; set; }
    }
}
