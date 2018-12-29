using CryptoBack.Controllers.Abstract;
using CryptoBack.Models;
using CryptoBack.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CryptoBack.Controllers
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

        [HttpGet("list")]
        public IList<Category> GetAll()
        {
            return _categoryService.GetAll();
        }

        [HttpPost("{parentId?}")]
        public Category Create(long? parentId, [FromBody] byte[] name)
        {
            return ForLoggedUser(user => _categoryService.Create(name, parentId));
        }
    }
}
