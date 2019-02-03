using System.Linq;

namespace Hashgard.Back.Models.Abstract
{
    public class Entity
    {
        public long Id { get; set; }
    }

    public static class EntityExtensions
    {
        public static T ForId<T>(this IQueryable<T> source, long? id) where T : Entity
        {
            return id.HasValue ? source.FirstOrDefault(e => e.Id == id.Value) : null;
        }
    }
}
