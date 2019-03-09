using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Linq.Expressions;

namespace Hashgard.Back.Models
{
    [NotMapped]
    public class Page<T>
    {
        public IList<T> Items { get; set; }
        public int Index { get; set; }
        public int Count { get; set; }
        public int TotalCount { get; set; }

        public Page()
        {
            Items = new List<T>();
        }
    }

    public static class PageExtension
    {
        public static Page<T> ToPage<T, TKey>(this IQueryable<T> source, int index, int count,
            Expression<Func<T, TKey>> orderBy, OrderBy? orderByDirection = OrderBy.Asc)
        {
            var orderedSource = orderByDirection == OrderBy.Asc
                ? source.OrderBy(orderBy) : source.OrderByDescending(orderBy);
            var items = orderedSource.Skip(index * count).Take(count).ToList();
            return new Page<T>()
            {
                Items = items,
                Index = index,
                Count = items.Count,
                TotalCount = source.Count()
            };
        }
    }

    public enum OrderBy
    {
        Asc = 0,
        Desc = 1
    }
}
