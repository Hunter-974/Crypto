using System;

namespace CryptoBack.Models.Abstract
{
    public class VersionedEntity : Entity
    {
        public Guid CorrelationUid { get; set; }

        public DateTime VersionDate { get; set; }
    }
}
