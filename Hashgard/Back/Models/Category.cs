using Hashgard.Back.Models.Abstract;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hashgard.Back.Models
{
    public class Category : Entity
    {
        [ForeignKey("User.Id")]
        public long? UserId { get; set; }
        
        public virtual User User { get; set; }

        [JsonIgnore]
        public virtual IList<Article> Articles { get; set; }

        [Required]
        public string Name { get; set; }
    }
}
