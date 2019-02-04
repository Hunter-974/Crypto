using Hashgard.Back.Controllers.Abstract;
using Hashgard.Back.Models;
using Hashgard.Back.Requests;
using Hashgard.Back.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

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
        public async Task<Article> CreateAsync([FromBody] CreateArticleRequest request)
        {
            return await ForLoggedUser(user => _articleService.CreateAsync(user.Id, request.CategoryId, request.Title, request.Text));
        }

        [HttpPut("{id}")]
        public async Task<Article> EditAsync(long id, [FromBody] EditArticleRequest request)
        {
            return await ForLoggedUser(user => _articleService.EditAsync(user.Id, id, request.Title, request.Text));
        }

        [HttpDelete("{id}")]
        public async Task Delete(long id)
        { 
            await ForLoggedUser(user => _articleService.DeleteAsync(user.Id, id));
        }
    }
}
