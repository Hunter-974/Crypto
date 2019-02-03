using Hashgard.Back.Controllers.Abstract;
using Hashgard.Back.Models;
using Hashgard.Back.Requests;
using Hashgard.Back.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace Hashgard.Back.Controllers
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
            return _reactionService.GetListForArticle(articleId);
        }

        [HttpGet("comment/{commentId}")]
        public IList<Reaction> GetAllForComment(long commentId)
        {
            return _reactionService.GetListForComment(commentId);
        }

        [HttpPost("article/{articleId}")]
        public ReactionType CreateForArticle(long articleId, [FromBody] Request<string> reactionType)
        {
            return ForLoggedUser(user => _reactionService.CreateForArticle(user.Id, articleId, reactionType.Value));
        }

        [HttpPost("comment/{commentId}")]
        public ReactionType CreateForComment(long commentId, [FromBody] Request<string> reactionType)
        {
            return ForLoggedUser(user => _reactionService.CreateForComment(user.Id, commentId, reactionType.Value));
        }

        [HttpPost("{reactionTypeId}")]
        public void Add(long reactionTypeId)
        {
            ForLoggedUser(user => _reactionService.Add(user.Id, reactionTypeId));
        }

        [HttpDelete("{reactionTypeId}")]
        public void Remove(long reactionTypeId)
        {
            ForLoggedUser(user => _reactionService.Remove(user.Id, reactionTypeId));
        }
    }
}
