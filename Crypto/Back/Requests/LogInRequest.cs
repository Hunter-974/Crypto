using System;

namespace Crypto.Back.Requests
{
    public class LogInRequest
    {
        public string Name { get; set; }

        public string Password { get; set; }

        public string Location { get; set; }

        public TimeSpan SessionLifetime { get; set; }
    }
}
