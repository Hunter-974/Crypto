using Hashgard.Back.Controllers.Abstract;
using Hashgard.Back.Models;
using Hashgard.Back.Requests;
using Hashgard.Back.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

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
        public Comment CreateForArticle(long articleId, [FromBody] Request<string> text)
        {
            return ForLoggedUser(user => _commentService.CreateForArticle(user.Id, articleId, text.Value));
        }

        [HttpPost("comment/{parentId}")]
        public Comment CreateForComment(long parentId, [FromBody] Request<string> text)
        {
            return ForLoggedUser(user => _commentService.CreateForComment(user.Id, parentId, text.Value));
        }

        [HttpPut("{id}")]
        public Comment Edit(long id, [FromBody] Request<string> text)
        {
            return ForLoggedUser(user => _commentService.Edit(user.Id, id, text.Value));
        }

        [HttpDelete("{id}")]
        public void Delete(long id)
        {
            ForLoggedUser(user => _commentService.Delete(user.Id, id));
        }
    }
}
