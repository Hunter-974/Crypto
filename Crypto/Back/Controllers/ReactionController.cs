using Crypto.Back.Controllers.Abstract;
using Crypto.Back.Models;
using Crypto.Back.Requests;
using Crypto.Back.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace Crypto.Back.Controllers
{
    [Route("api/reaction")]
    public class ReactionController : BaseAuthController
    {
        private readonly IReactionService _reactionService;

        public ReactionController(IUserService userService, IReactionService reactionService)
            : base(userService)
        {
            _reactionService = reactionService;
        }

        [HttpGet("article/{articleId}")]
        public IList<Reaction> GetAllForArticle(long articleId)
        {
            return _reactionService.GetAllForArticle(articleId);
        }

        [HttpGet("comment/{commentId}")]
        public IList<Reaction> GetAllForComment(long commentId)
        {
            return _reactionService.GetAllForComment(commentId);
        }

        [HttpPost("article/{articleId}")]
        public Reaction SetForArticle(long userId, long articleId, [FromBody] Request<string> reactionType)
        {
            return ForLoggedUser(user => _reactionService.SetForArticle(user.Id, articleId, reactionType.Value));
        }

        [HttpPost("comment/{commentId}")]
        public Reaction SetForComment(long userId, long commentId, [FromBody] Request<string> reactionType)
        {
            return ForLoggedUser(user => _reactionService.SetForComment(user.Id, commentId, reactionType.Value));
        }
    }
}
