using Crypto.Back.Models.Abstract;
using Newtonsoft.Json;
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

        [JsonIgnore]
        public virtual Category Parent { get; set; }

        [JsonIgnore]
        public virtual IList<Category> Children { get; set; }

        [JsonIgnore]
        public virtual IList<Article> Articles { get; set; }


        [Required]
        public string Name { get; set; }
    }
}
