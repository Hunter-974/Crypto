using Crypto.Back.Controllers.Abstract;
using Crypto.Back.Models;
using Crypto.Back.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace Crypto.Back.Controllers
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
        public IList<Comment> GetListForArticle(long articleId, int index, int count)
        {
            return _commentService.GetListForArticle(articleId, index, count);
        }

        [HttpGet("comment/{commentId}/{index}/{count}")]
        public IList<Comment> GetListForComment(long commentId, int index, int count)
        {
            return _commentService.GetListForComment(commentId, index, count);
        }

        [HttpGet("{id}/versions")]
        public IList<Comment> GetAllVersions(long id)
        {
            return _commentService.GetAllVersions(id);
        }

        [HttpPost("article/{articleId}")]
        public Comment CreateForArticle(long articleId, string text)
        {
            return ForLoggedUser(user => _commentService.CreateForArticle(user.Id, articleId, text));
        }

        [HttpPost("comment/{parentId}")]
        public Comment CreateForComment(long parentId, [FromBody] string text)
        {
            return ForLoggedUser(user => _commentService.CreateForComment(user.Id, parentId, text));
        }

        [HttpPut("{id}")]
        public Comment Edit(long id, [FromBody] string text)
        {
            return ForLoggedUser(user => _commentService.Edit(user.Id, id, text));
        }
    }
}
