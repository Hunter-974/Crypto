using System;

namespace Crypto.Back.Models.Abstract
{
    public class VersionedEntity : Entity
    {
        public Guid CorrelationUid { get; set; }

        public DateTime VersionDate { get; set; }
    }
}
