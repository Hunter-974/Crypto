using Crypto.Back.Controllers.Abstract;
using Crypto.Back.Models;
using Crypto.Back.Requests;
using Crypto.Back.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Crypto.Back.Controllers
{
    [Route("api/category")]
    public class CategoryController : BaseAuthController
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(IUserService userService, ICategoryService categoryService)
            : base(userService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public IList<Category> GetParents()
        {
            return _categoryService.GetParents();
        }

        [HttpGet("{parentId}")]
        public IList<Category> GetChildren(long parentId)
        {
            return _categoryService.GetChildren(parentId);
        }

        [HttpPost("{parentId?}")]
        public Category Create(long? parentId, [FromBody] Request<string> name)
        {
            return ForLoggedUser(user => _categoryService.Create(user.Id, name.Value, parentId));
        }
    }
}
