using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace Crypto.Back.Models
{
    [NotMapped]
    public class Page<T> : IList<T>
    {

        public IList<T> Items { get; set; }
        public int Index { get; set; }
        public int Count { get; set; }
        public int TotalCount { get; set; }

        #region IList implementation

        public T this[int index]
        {
            get => Items[index];
            set => Items[index] = value;
        }

        public bool IsReadOnly => Items.IsReadOnly;

        public void Add(T item)
        {
            Items.Add(item);
        }

        public void Clear()
        {
            Items.Clear();
        }

        public bool Contains(T item)
        {
            return Items.Contains(item);
        }

        public void CopyTo(T[] array, int arrayIndex)
        {
            Items.CopyTo(array, arrayIndex);
        }

        public IEnumerator<T> GetEnumerator()
        {
            return Items.GetEnumerator();
        }

        public int IndexOf(T item)
        {
            return Items.IndexOf(item);
        }

        public void Insert(int index, T item)
        {
            Items.Insert(index, item);
        }

        public bool Remove(T item)
        {
            return Items.Remove(item);
        }

        public void RemoveAt(int index)
        {
            Items.RemoveAt(index);
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return Items.GetEnumerator();
        }

        #endregion

        public Page()
        {
            Items = new List<T>();
        }
    }

    public static class PageExtension
    {
        public static Page<T> ToPage<T>(this IEnumerable<T> source)
        {
            var count = source.Count();
            return new Page<T>()
            {
                Items = source.ToList(),
                Index = count,
                Count = count,
                TotalCount = count
            };
        }

        public static Page<T> ToPage<T>(this IEnumerable<T> source, int totalCount)
        {
            var page = source.ToPage();
            page.TotalCount = totalCount;
            return page;
        }
    }
}
