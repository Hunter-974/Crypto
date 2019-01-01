using System;

namespace CryptoBack.Requests
{
    public class LogInRequest
    {
        public string Name { get; set; }

        public string Password { get; set; }

        public TimeSpan SessionLifetime { get; set; }
    }
}
