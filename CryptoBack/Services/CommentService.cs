using CryptoBack.Db;
using CryptoBack.Models;
using CryptoBack.Services.Abstract;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CryptoBack.Services
{
    public interface ICommentService
    {
        IList<Comment> GetListForArticle(long articleId, int index, int count);
        IList<Comment> GetListForComment(long commentId, int index, int count);
        IList<Comment> GetAllVersions(long id);
        Comment CreateForArticle(long userId, long articleId, string text);
        Comment CreateForComment(long userId, long commentId, string text);
        Comment Edit(long userId, long id, string text);
    }

    public class CommentService : BaseService, ICommentService
    {
        public CommentService(Context context) : base(context)
        {
        }

        public IList<Comment> GetListForArticle(long articleId, int index, int count)
        {
            return GetList(articleId, null, index, count);
        }

        public IList<Comment> GetListForComment(long commentId, int index, int count)
        {
            return GetList(null, commentId, index, count);
        }

        private IList<Comment> GetList(long? articleId, long? commentId, int index, int count)
        {
            var list = Context.Comments
                .Where(a => a.ArticleId == articleId && a.CommentId == commentId)
                .Skip(index).Take(count).ToList();

            foreach (var comment in list)
            {
                SetReactionCounts(comment);
            }

            return list;
        }

        public IList<Comment> GetAllVersions(long id)
        {
            var comment = Context.Comments.FirstOrDefault(c => c.Id == id);
            var related = Context.Comments
                .Where(c => c.CorrelationUid == comment.CorrelationUid && c.Id != id)
                .OrderByDescending(c => c.VersionDate)
                .ToList();
            return related;
        }

        public Comment CreateForArticle(long userId, long articleId, string text)
        {
            return Add(userId, articleId, null, text);
        }

        public Comment CreateForComment(long userId, long commentId, string text)
        {
            return Add(userId, null, commentId, text);
        }

        private Comment Add(long userId, long? articleId, long? commentId, string text)
        {
            var comment = new Comment
            {
                UserId = userId,
                ArticleId = articleId,
                CommentId = commentId,
                Text = text,
                CorrelationUid = Guid.NewGuid(),
                VersionDate = DateTime.Now
            };

            Context.Comments.Add(comment);
            Context.SaveChanges();

            return comment;
        }

        public Comment Edit(long userId, long id, string text)
        {
            var oldComment = Context.Comments
                .Include(c => c.Children)
                .Include(c => c.Reactions)
                .FirstOrDefault(c => c.Id == id);

            if (oldComment == null)
            {
                throw new Exception("Comment does not exist.");
            }

            if (oldComment.UserId != userId)
            {
                throw new Exception("User not allowed.");
            }

            var newComment = oldComment;

            if (oldComment.Text != text)
            {
                newComment = new Comment
                {
                    UserId = oldComment.UserId,
                    ArticleId = oldComment.ArticleId,
                    CommentId = oldComment.CommentId,
                    Text = text,
                    CorrelationUid = oldComment.CorrelationUid,
                    VersionDate = DateTime.Now
                };
                Context.Comments.Add(newComment);

                foreach (var child in oldComment.Children)
                {
                    child.CommentId = newComment.Id;
                    Context.Comments.Update(child);
                }

                foreach (var reaction in oldComment.Reactions)
                {
                    reaction.CommentId = newComment.Id;
                    Context.Reactions.Update(reaction);
                }

                Context.SaveChanges();
            }

            SetReactionCounts(newComment);

            return newComment;
        }

        private void SetReactionCounts(Comment comment)
        {
            var reactionCounts = Context.Reactions
                .Where(r => r.CommentId == comment.Id)
                .GroupBy(r => r.ReactionType)
                .Select(g => new ReactionCount() { ReactionType = g.Key, Count = g.Count() })
                .ToList();
            comment.ReactionCounts = reactionCounts;
        }
    }
}
