using Hashgard.Back.Hubs.Helpers;
using System;

namespace Hashgard.Back.Requests
{
    public class SubscribeRequest
    {
        public ObjectType ObjectType { get; set; }
        public long ObjectId { get; set; }
        public Guid HubsToken { get; set; }
    }
}
