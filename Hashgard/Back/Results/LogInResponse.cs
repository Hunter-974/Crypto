using Hashgard.Back.Models;
using System;

namespace Hashgard.Back.Results
{
    public class LogInResponse
    {
        public Guid Token { get; set; }
        public long UserId { get; set; }

        public LogInResponse()
        {

        }

        public LogInResponse(User user)
        {
            if (user.Token.HasValue)
            {
                Token = user.Token.Value;
            }
            UserId = user.Id;
        }
    }
}
