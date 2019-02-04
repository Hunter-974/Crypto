using Hashgard.Back.Db;
using Hashgard.Back.Hubs;
using Hashgard.Back.Models;
using Hashgard.Back.Models.Abstract;
using Hashgard.Back.Services.Abstract;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Transactions;

namespace Hashgard.Back.Services
{
    public interface IReactionService
    {
        IList<Reaction> GetListForArticle(long articleId);
        IList<Reaction> GetListForComment(long commentId);
        Task<ReactionType> CreateForArticleAsync(long userId, long articleId, string reactionTypeName);
        Task<ReactionType> CreateForCommentAsync(long userId, long commentId, string reactionTypeName);
        Task<ReactionType> AddAsync(long userId, long reactionTypeId);
        Task<ReactionType> RemoveAsync(long userId, long reactionTypeId);
    }

    public class ReactionService : BaseService, IReactionService
    {
        private readonly IHubContext<ReactionHub, IReactionHubClient> _reactionHubContext;


        public ReactionService(HashgardContext context, IHubContext<ReactionHub, IReactionHubClient> reactionHubContext) 
            : base(context)
        {
            _reactionHubContext = reactionHubContext;
        }

        public IList<Reaction> GetListForArticle(long articleId)
        {
            return GetList(articleId, null);
        }

        public IList<Reaction> GetListForComment(long commentId)
        {
            return GetList(null, commentId);
        }

        private IList<Reaction> GetList(long? articleId, long? commentId)
        {
            var allReactions = HashgardContext.ReactionTypes
                .Where(r => r.ArticleId == articleId && r.CommentId == commentId)
                .Include(r => r.Reactions).ThenInclude(r => r.User)
                .SelectMany(rt => rt.Reactions)
                .ToList();

            return allReactions;
        }

        public Task<ReactionType> CreateForArticleAsync(long userId, long articleId, string reactionTypeName)
        {
            return CreateAsync(userId, null, articleId, reactionTypeName);
        }

        public Task<ReactionType> CreateForCommentAsync(long userId, long commentId, string reactionTypeName)
        {
            return CreateAsync(userId, commentId, null, reactionTypeName);
        }

        private async Task<ReactionType> CreateAsync(long userId, long? commentId, long? articleId, string reactionTypeName)
        {
            ReactionType reactionType = new ReactionType()
            {
                ArticleId = articleId,
                CommentId = commentId, 
                Name = reactionTypeName,
                Reactions = new []
                {
                    new Reaction { UserId = userId }
                }
            };

            HashgardContext.ReactionTypes.Add(reactionType);
            await HashgardContext.SaveChangesAsync();

            await Task.Run(() => 
                _reactionHubContext.Clients.Others().Changed(reactionType)
                .ConfigureAwait(false));

            return reactionType;
        }

        public async Task<ReactionType> AddAsync(long userId, long reactionTypeId)
        {
            using (var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var reactionType = HashgardContext.ReactionTypes
                    .Include(rt => rt.Reactions)
                    .ForId(reactionTypeId);

                if (reactionType == null)
                {
                    throw new Exception("Reaction type does not exist.");
                }

                var reaction = reactionType.Reactions
                    .FirstOrDefault(r => r.UserId == userId);

                if (reaction == null)
                {
                    reaction = new Reaction()
                    {
                        UserId = userId,
                        ReactionTypeId = reactionTypeId
                    };

                    reactionType.Reactions.Add(reaction);
                    HashgardContext.Update(reactionType);

                    await HashgardContext.SaveChangesAsync();
                    transaction.Complete();

                    await Task.Run(() => 
                        _reactionHubContext.Clients.Others().Changed(reactionType)
                        .ConfigureAwait(false));
                }

                return reactionType;
            }
        }

        public async Task<ReactionType> RemoveAsync(long userId, long reactionTypeId)
        {
            using (var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var reactionType = HashgardContext.ReactionTypes
                .Include(rt => rt.Reactions)
                .ForId(reactionTypeId);

                if (reactionType == null)
                {
                    throw new Exception("Reaction type does not exist.");
                }

                var reaction = reactionType.Reactions
                    .FirstOrDefault(r => r.UserId == userId);

                if (reaction != null)
                {
                    reactionType.Reactions.Remove(reaction);
                    HashgardContext.ReactionTypes.Update(reactionType);

                    await HashgardContext.SaveChangesAsync();
                    transaction.Complete();

                    await Task.Run(() => 
                        _reactionHubContext.Clients.Others().Changed(reactionType)
                        .ConfigureAwait(false));
                }

                return reactionType;
            }
        }
    }
}
