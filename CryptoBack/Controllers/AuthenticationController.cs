using CryptoBack.Controllers.Abstract;
using CryptoBack.Models;
using CryptoBack.Requests;
using CryptoBack.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CryptoBack.Controllers
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

        [HttpPost("signin")]
        public User SignIn([FromBody] SignInRequest request)
        {
            return _userService.SignIn(request.Name, request.Password, request.Location, request.SessionLifetime);
        }

        [HttpPost("login")]
        public User LogIn([FromBody] LogInRequest request)
        {
            return _userService.LogIn(request.Name, request.Password, request.SessionLifetime);
        }

        [HttpPost("logout")]
        public void LogOut()
        {
            var token = GetToken();
            if (token.HasValue)
            {
                _userService.LogOut(token.Value);
            }
        }
    }
}
