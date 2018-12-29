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
        public Comment AddForArticle(long articleId, byte[] text)
        {
            return ForLoggedUser(user => _commentService.AddForArticle(user.Id, articleId, text));
        }

        [HttpPost("comment/{parentId}")]
        public Comment AddForComment(long parentId, [FromBody] byte[] text)
        {
            return ForLoggedUser(user => _commentService.AddForComment(user.Id, parentId, text));
        }

        [HttpPut("{id}")]
        public Comment Edit(long id, [FromBody] byte[] text)
        {
            return ForLoggedUser(user => _commentService.Edit(user.Id, id, text));
        }
    }
}
