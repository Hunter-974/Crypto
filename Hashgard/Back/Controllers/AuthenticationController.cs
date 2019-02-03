using Hashgard.Back.Controllers.Abstract;
using Hashgard.Back.Requests;
using Hashgard.Back.Results;
using Hashgard.Back.Services;
using Hashgard.Back.Utils;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;

namespace Hashgard.Back.Controllers
{
    [Route("api/auth")]
    public class AuthenticationController : BaseAuthController
    {
        private readonly IUserService _userService;

        public AuthenticationController(IUserService userService)
            : base(userService)
        {
            _userService = userService;
        }

        [HttpPost("signup")]
        public LogInResponse SignUp([FromBody] LogInRequest request)
        {
            return _userService.SignUp(request.Name, request.Password, request.SessionLifetime);
        }

        [HttpPost("login")]
        public LogInResponse LogIn([FromBody] LogInRequest request)
        {
            return _userService.LogIn(request.Name, request.Password, request.SessionLifetime);
        }

        [HttpPost("logout")]
        public void LogOut()
        {
            if (HttpContext.TryGetUserToken(out var token))
            {
                _userService.LogOut(token);
            }
        }
    }
}
