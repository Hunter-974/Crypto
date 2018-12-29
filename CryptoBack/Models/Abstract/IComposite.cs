using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using System.Collections.Generic;
using System.Linq;

namespace CryptoBack.Models.Abstract
{
    public interface IComposite<T> where T : Entity, IComposite<T>, new()
    {
        T Parent { get; set; }
        IList<T> Children { get; set; }
    }

    public static class CompositeExtensions
    {

        public static IIncludableQueryable<TEntity, IList<TEntity>> IncludeChildren<TEntity>(this IQueryable<TEntity> source) where TEntity : Entity, IComposite<TEntity>, new()
        {
            return source.Include(e => e.Children);
        }
    }

}
