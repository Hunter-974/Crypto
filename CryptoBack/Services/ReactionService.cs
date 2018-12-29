using CryptoBack.Db;
using CryptoBack.Models;
using CryptoBack.Services.Abstract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CryptoBack.Services
{
    public interface IReactionService
    {
        Reaction SetForArticle(long userId, long articleId, byte[] reactionType);
        Reaction SetForComment(long userId, long commentId, byte[] reactionType);
    }

    public class ReactionService : BaseService, IReactionService
    {
        public ReactionService(Context context) : base(context)
        {

        }

        public Reaction SetForArticle(long userId, long articleId, byte[] reactionType)
        {
            return Set(userId, null, articleId, reactionType);
        }

        public Reaction SetForComment(long userId, long commentId, byte[] reactionType)
        {
            return Set(userId, commentId, null, reactionType);
        }

        private Reaction Set(long userId, long? commentId, long? articleId, byte[] reactionType)
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
