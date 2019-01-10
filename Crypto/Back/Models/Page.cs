using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Crypto.Back.Models
{
    [NotMapped]
    public class Page<T>
    {
        public IList<T> Items { get; set; }
        public int Index { get; set; }
        public int Count { get; set; }
        public int TotalCount { get; set; }
    }
}
