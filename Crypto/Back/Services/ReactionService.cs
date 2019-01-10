using Crypto.Back.Db;
using Crypto.Back.Models;
using Crypto.Back.Services.Abstract;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace Crypto.Back.Services
{
    public interface IReactionService
    {
        IList<Reaction> GetAllForArticle(long articleId);
        IList<Reaction> GetAllForComment(long commentId);
        Reaction SetForArticle(long userId, long articleId, string reactionType);
        Reaction SetForComment(long userId, long commentId, string reactionType);
    }

    public class ReactionService : BaseService, IReactionService
    {
        public ReactionService(Context context) : base(context)
        {

        }

        public IList<Reaction> GetAllForArticle(long articleId)
        {
            return Get(articleId, null);
        }

        public IList<Reaction> GetAllForComment(long commentId)
        {
            return Get(null, commentId);
        }

        public IList<Reaction> Get(long? articleId, long? commentId)
        {
            return Context.Reactions
                .Where(r => r.ArticleId == articleId && r.CommentId == commentId)
                .Include(r => r.User)
                .ToList();
        }

        public Reaction SetForArticle(long userId, long articleId, string reactionType)
        {
            return Set(userId, null, articleId, reactionType);
        }

        public Reaction SetForComment(long userId, long commentId, string reactionType)
        {
            return Set(userId, commentId, null, reactionType);
        }

        private Reaction Set(long userId, long? commentId, long? articleId, string reactionType)
        {
            var existing = Context.Reactions
                .Where(r => r.UserId == userId && r.CommentId == commentId && r.ArticleId == articleId)
                .FirstOrDefault();

            Reaction reaction = null;

            if (existing == null)
            {
                if (reactionType != null)
                {
                    reaction = new Reaction
                    {
                        UserId = userId,
                        CommentId = commentId,
                        ArticleId = articleId,
                        ReactionType = reactionType
                    };
                    Context.Reactions.Add(reaction);
                    Context.SaveChanges();
                }
            }
            else
            {
                if (reactionType == null)
                {
                    Context.Reactions.Remove(existing);
                    Context.SaveChanges();
                }
                else
                {
                    existing.ReactionType = reactionType;
                    Context.Reactions.Update(existing);
                    Context.SaveChanges();
                    reaction = existing;
                }
            }

            return reaction;
        }
    }
}
