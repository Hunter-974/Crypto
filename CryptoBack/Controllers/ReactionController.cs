using CryptoBack.Controllers.Abstract;
using CryptoBack.Models;
using CryptoBack.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace CryptoBack.Controllers
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
        public Reaction SetForArticle(long userId, long articleId, string reactionType)
        {
            return ForLoggedUser(user => _reactionService.SetForArticle(user.Id, articleId, reactionType));
        }

        [HttpPost("comment/{commentId}")]
        public Reaction SetForComment(long userId, long commentId, string reactionType)
        {
            return ForLoggedUser(user => _reactionService.SetForComment(user.Id, commentId, reactionType));
        }
    }
}
