using Crypto.Back.Controllers.Abstract;
using Crypto.Back.Requests;
using Crypto.Back.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;

namespace Crypto.Back.Controllers
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
    public Guid SignUp([FromBody] LogInRequest request)
    {
      return _userService.SignUp(request.Name, request.Password, request.Location, request.SessionLifetime);
    }

    [HttpPost("login")]
    public Guid LogIn([FromBody] LogInRequest request)
    {
      return _userService.LogIn(request.Name, request.Password, request.Location, request.SessionLifetime);
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
