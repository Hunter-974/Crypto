using Crypto.Back.Controllers.Abstract;
using Crypto.Back.Models;
using Crypto.Back.Requests;
using Crypto.Back.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace Crypto.Back.Controllers
{
    [Controller, Route("api/article")]
    public class ArticleController : BaseAuthController
    {
        private readonly IArticleService _articleService;

        public ArticleController(IUserService userService, IArticleService articleService)
            : base(userService)
        {
            _articleService = articleService;
        }

        [HttpGet("list/{categoryId}/{index}/{count}")]
        public Page<Article> GetList(long categoryId, int index, int count)
        {
            return _articleService.GetList(categoryId, index, count);
        }

        [HttpGet("{id}")]
        public Article Get(long id)
        {
            return _articleService.Get(id);
        }

        [HttpGet("{id}/versions")]
        public IList<Article> GetAllVersions(long id)
        {
            return _articleService.GetAllVersions(id);
        }

        [HttpPost]
        public Article Create([FromBody] CreateArticleRequest request)
        {
            return ForLoggedUser(user => _articleService.Create(user.Id, request.CategoryId, request.Title, request.Text));
        }

        [HttpPut("{id}")]
        public Article Edit(long id, [FromBody] EditArticleRequest request)
        {
            return ForLoggedUser(user => _articleService.Edit(user.Id, id, request.Title, request.Text));
        }
    }
}
