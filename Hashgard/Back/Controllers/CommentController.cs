using Hashgard.Back.Controllers.Abstract;
using Hashgard.Back.Models;
using Hashgard.Back.Requests;
using Hashgard.Back.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Hashgard.Back.Controllers
{
    [Route("api/comment")]
    public class CommentController : BaseAuthController
    {
        private readonly ICommentService _commentService;

        public CommentController(IUserService userService, ICommentService commentService)
        : base(userService)
        {
            _commentService = commentService;
        }

        [HttpGet("article/{articleId}/{index}/{count}")]
        public Page<Comment> GetListForArticle(long articleId, int index, int count)
        {
            var userId = GetLoggedUser()?.Id;
            return _commentService.GetListForArticle(userId, articleId, index, count);
        }

        [HttpGet("comment/{commentId}/{index}/{count}")]
        public Page<Comment> GetListForComment(long commentId, int index, int count)
        {
            var userId = GetLoggedUser()?.Id;
            return _commentService.GetListForComment(userId, commentId, index, count);
        }

        [HttpGet("{id}/versions")]
        public Page<Comment> GetAllVersions(long id)
        {
            return _commentService.GetAllVersions(id);
        }

        [HttpPost("article/{articleId}")]
        public async Task<Comment> CreateForArticle(long articleId, [FromBody] Request<string> text)
        {
            return await ForLoggedUser(user => _commentService.CreateForArticleAsync(user.Id, articleId, text.Value));
        }

        [HttpPost("comment/{parentId}")]
        public async Task<Comment> CreateForCommentAsync(long parentId, [FromBody] Request<string> text)
        {
            return await ForLoggedUser(user => _commentService.CreateForCommentAsync(user.Id, parentId, text.Value));
        }

        [HttpPut("{id}")]
        public async Task<Comment> Edit(long id, [FromBody] Request<string> text)
        {
            return await ForLoggedUser(user => _commentService.EditAsync(user.Id, id, text.Value));
        }

        [HttpDelete("{id}")]
        public async Task Delete(long id)
        {
            await ForLoggedUser(user => _commentService.DeleteAsync(user.Id, id));
        }
    }
}
