using Crypto.Back.Models;
using Crypto.Back.Services;
using Crypto.Back.Utils;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Net;

namespace Crypto.Back.Controllers.Abstract
{
    public abstract class BaseAuthController : Controller
    {
        private readonly IUserService _userService;

        protected BaseAuthController(IUserService userService)
        {
            _userService = userService;
        }

        protected User GetLoggedUser()
        {
            User user = null;

            if (HttpContext.TryGetUserToken(out var token))
            {
                user = _userService.GetAuthenticatedUser(token);
            }

            return user;
        }

        protected T ForLoggedUser<T>(Func<User, T> execute) where T : class, new()
        {
            var user = GetLoggedUser();
            T entity = null;

            if (user == null)
            {
                Response.StatusCode = (int)HttpStatusCode.Unauthorized;
            }
            else
            {
                entity = execute(user);
            }

            return entity;
        }

        protected void ForLoggedUser(Action<User> execute)
        {
            var user = GetLoggedUser();

            if (user == null)
            {
                Response.StatusCode = (int)HttpStatusCode.Unauthorized;
            }
            else
            {
                execute(user);
            }
        }
    }
}
