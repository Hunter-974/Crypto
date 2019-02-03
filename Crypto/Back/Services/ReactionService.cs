using Crypto.Back.Db;
using Crypto.Back.Hubs;
using Crypto.Back.Models;
using Crypto.Back.Models.Abstract;
using Crypto.Back.Services.Abstract;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace Crypto.Back.Services
{
    public interface IReactionService
    {
        IList<Reaction> GetListForArticle(long articleId);
        IList<Reaction> GetListForComment(long commentId);
        ReactionType CreateForArticle(long userId, long articleId, string reactionTypeName);
        ReactionType CreateForComment(long userId, long commentId, string reactionTypeName);
        void Add(long userId, long reactionTypeId);
        void Remove(long userId, long reactionTypeId);
    }

    public class ReactionService : BaseService, IReactionService
    {
        private readonly IHubContext<ReactionHub, IReactionHubClient> _reactionHubContext;


        public ReactionService(CryptoDbContext context, IHubContext<ReactionHub, IReactionHubClient> reactionHubContext) 
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
            var allReactions = CryptoDbContext.ReactionTypes
                .Where(r => r.ArticleId == articleId && r.CommentId == commentId)
                .Include(r => r.Reactions).ThenInclude(r => r.User)
                .SelectMany(rt => rt.Reactions)
                .ToList();

            return allReactions;
        }

        public ReactionType CreateForArticle(long userId, long articleId, string reactionTypeName)
        {
            return Create(userId, null, articleId, reactionTypeName);
        }

        public ReactionType CreateForComment(long userId, long commentId, string reactionTypeName)
        {
            return Create(userId, commentId, null, reactionTypeName);
        }

        private ReactionType Create(long userId, long? commentId, long? articleId, string reactionTypeName)
        {
            ReactionType reactionType = new ReactionType()
            {
                ArticleId = articleId,
                CommentId = commentId, 
                Name = reactionTypeName,
                Reactions = new []
                {
                    new Reaction { UserId = userId }
                },
                HasUserReacted = true,
                ReactionCount = 1
            };

            CryptoDbContext.ReactionTypes.Add(reactionType);
            CryptoDbContext.SaveChanges();

            _reactionHubContext.Clients.Others().Changed(reactionType).Wait();

            return reactionType;
        }

        public void Add(long userId, long reactionTypeId)
        {
            var exists = CryptoDbContext.Reactions
                .Any(r => r.UserId == userId && r.ReactionTypeId == reactionTypeId);

            if (!exists)
            {
                var reaction = new Reaction()
                {
                    UserId = userId,
                    ReactionTypeId = reactionTypeId
                };

                CryptoDbContext.Reactions.Add(reaction);
                CryptoDbContext.SaveChanges();

                var reactionType = CryptoDbContext.ReactionTypes.ForId(reactionTypeId);
                _reactionHubContext.Clients.Others().Changed(reactionType).Wait();
            }
        }

        public void Remove(long userId, long reactionTypeId)
        {
            var existing = CryptoDbContext.Reactions
                .Where(r => r.UserId == userId && r.ReactionTypeId == reactionTypeId)
                .FirstOrDefault();

            if (existing != null)
            {
                CryptoDbContext.Reactions.Remove(existing);
                CryptoDbContext.SaveChanges();

                var reactionType = CryptoDbContext.ReactionTypes.ForId(reactionTypeId);
                _reactionHubContext.Clients.Others().Changed(reactionType).Wait();
            }
        }
    }
}
