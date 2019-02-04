using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using System.Collections.Generic;
using System.Linq;

namespace Hashgard.Back.Models.Abstract
{
    public interface IComposite<T> where T : Entity, IComposite<T>, new()
    {
        long? ParentId { get; set; }
        T Parent { get; set; }
        IList<T> Children { get; set; }
    }

    public static class CompositeExtensions
    {
    }

}
