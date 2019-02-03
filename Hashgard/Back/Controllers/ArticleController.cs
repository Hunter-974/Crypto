using Hashgard.Back.Controllers.Abstract;
using Hashgard.Back.Models;
using Hashgard.Back.Requests;
using Hashgard.Back.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace Hashgard.Back.Controllers
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
            var userId = GetLoggedUser()?.Id;
            return _articleService.GetList(userId, categoryId, index, count);
        }

        [HttpGet("{id}")]
        public Article Get(long id)
        {
            var userId = GetLoggedUser()?.Id;
            return _articleService.Get(userId, id);
        }

        [HttpGet("{id}/versions")]
        public Page<Article> GetAllVersions(long id)
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

        [HttpDelete("{id}")]
        public void Delete(long id)
        { 
            ForLoggedUser(user => _articleService.Delete(user.Id, id));
        }
    }
}
