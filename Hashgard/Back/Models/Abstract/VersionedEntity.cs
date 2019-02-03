using System;
using System.Linq;

namespace Hashgard.Back.Models.Abstract
{
    public class VersionedEntity : Entity
    {
        public Guid CorrelationUid { get; set; }

        public DateTime VersionDate { get; set; }
    }

    public static class VersionedEntityExtensions
    {
        public static IQueryable<T> GetLastVersions<T>(this IQueryable<T> source) where T : VersionedEntity
        {
            return source.GroupBy(
                i => i.CorrelationUid,
                (uid, group) => group.FirstOrDefault(i1 => i1.VersionDate == group.Max(i2 => i2.VersionDate))
            );
        }
    }
}
