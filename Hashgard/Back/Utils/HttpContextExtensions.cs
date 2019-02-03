using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using System;
using System.Linq;

namespace Hashgard.Back.Utils
{
    public static class HttpContextExtensions
    {
        public static bool TryGetHubsToken(this HttpContext httpContext, out Guid hubsToken)
        {
            hubsToken = Guid.Empty;

            return httpContext.TryGetTokenString("HubsToken", out var userTokenString)
                && Guid.TryParse(userTokenString, out hubsToken);
        }

        public static bool TryGetUserToken(this HttpContext httpContext, out Guid userToken)
        {
            userToken = Guid.Empty;

            return httpContext.TryGetTokenString("UserToken", out var userTokenString)
                && Guid.TryParse(userTokenString, out userToken);
        }

        private static bool TryGetTokenString(this HttpContext httpContext, string key, out StringValues tokenString)
        {
            return httpContext.Request.Headers.TryGetValue(key, out tokenString) && !string.IsNullOrEmpty(tokenString);
        }
    }
}
