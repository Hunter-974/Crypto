using System;

namespace CryptoBack.Requests
{
    public class LogInRequest
    {
        public byte[] Name { get; set; }

        public byte[] Password { get; set; }

        public TimeSpan SessionLifetime { get; set; }
    }
}
