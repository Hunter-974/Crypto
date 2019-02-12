using Hashgard.Back.Controllers.Abstract;
using Hashgard.Back.Models;
using Hashgard.Back.Requests;
using Hashgard.Back.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace Hashgard.Back.Controllers
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
        public IList<Category> GetList()
        {
            return _categoryService.GetList();
        }

        [HttpPost]
        public Category Create(long? parentId, [FromBody] Request<string> name)
        {
            return ForLoggedUser(user => _categoryService.Create(user.Id, name.Value));
        }
    }
}
