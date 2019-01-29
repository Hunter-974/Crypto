using Crypto.Back.Models.Abstract;
using System.ComponentModel.DataAnnotations.Schema;

namespace Crypto.Back.Models
{
    public class Reaction : Entity
    {
        [ForeignKey("User.Id")]
        public long UserId { get; set; }

        [ForeignKey("ReactionType.Id")]
        public long ReactionTypeId { get; set; }


        public virtual User User { get; set; }

        public virtual ReactionType ReactionType { get; set; }
    }
}
