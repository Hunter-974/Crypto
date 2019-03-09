using Hashgard.Back.Controllers.Abstract;
using Hashgard.Back.Models;
using Hashgard.Back.Requests;
using Hashgard.Back.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

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
        public async Task<ReactionType> CreateForArticleAsync(long articleId, [FromBody] Request<string> reactionType)
        {
            return await ForLoggedUser(user => _reactionService.CreateForArticleAsync(user.Id, articleId, reactionType.Value));
        }

        [HttpPost("comment/{commentId}")]
        public async Task<ReactionType> CreateForCommentAsync(long commentId, [FromBody] Request<string> reactionType)
        {
            return await ForLoggedUser(user => _reactionService.CreateForCommentAsync(user.Id, commentId, reactionType.Value));
        }

        [HttpPost("{reactionTypeId}")]
        public async Task<ReactionType> AddAsync(long reactionTypeId)
        {
            return await ForLoggedUser(user => _reactionService.AddAsync(user.Id, reactionTypeId));
        }

        [HttpDelete("{reactionTypeId}")]
        public async Task<ReactionType> RemoveAsync(long reactionTypeId)
        {
            return await ForLoggedUser(user => _reactionService.RemoveAsync(user.Id, reactionTypeId));
        }
    }
}
