
using CryptoBack.Controllers.Abstract;
using CryptoBack.Models;
using CryptoBack.Services;
using Microsoft.AspNetCore.Mvc;

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

        [HttpPost("article/{articleId}")]
        public Reaction SetForArticle(long userId, long articleId, byte[] reactionType)
        {
            return ForLoggedUser(user => _reactionService.SetForArticle(user.Id, articleId, reactionType));
        }

        [HttpPost("comment/{commentId}")]
        public Reaction SetForComment(long userId, long commentId, byte[] reactionType)
        {
            return ForLoggedUser(user => _reactionService.SetForComment(user.Id, commentId, reactionType));
        }
    }
}
