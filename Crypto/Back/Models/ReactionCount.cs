using System.ComponentModel.DataAnnotations.Schema;

namespace Crypto.Back.Models
{
    [NotMapped]
    public class ReactionCount
    {
        public string ReactionType { get; set; }

        public int Count { get; set; }
    }
}
