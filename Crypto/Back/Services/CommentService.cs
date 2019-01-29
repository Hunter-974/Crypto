using Crypto.Back.Db;
using Crypto.Back.Models;
using Crypto.Back.Models.Abstract;
using Crypto.Back.Services.Abstract;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Crypto.Back.Services
{
    public interface ICommentService
    {
        Page<Comment> GetListForArticle(long articleId, int index, int count);
        Page<Comment> GetListForComment(long commentId, int index, int count);
        Page<Comment> GetAllVersions(long id);
        Comment CreateForArticle(long userId, long articleId, string text);
        Comment CreateForComment(long userId, long commentId, string text);
        Comment Edit(long userId, long id, string text);
        void Delete(long userId, long id);
    }

    public class CommentService : BaseService, ICommentService
    {
        public CommentService(Context context) : base(context)
        {
        }

        public Page<Comment> GetListForArticle(long articleId, int index, int count)
        {
            return GetList(articleId, null, index, count);
        }

        public Page<Comment> GetListForComment(long commentId, int index, int count)
        {
            return GetList(null, commentId, index, count);
        }

        private Page<Comment> GetList(long? articleId, long? commentId, int index, int count)
        {
            var page = Context.Comments
                .Where(c => c.ArticleId == articleId && c.ParentId == commentId)
                .Include(c => c.User)
                .GetLastVersions()
                .ToPage(index, count, c => c.VersionDate, OrderBy.Desc);
            
            Context.SetReactionTypes<Comment>(page.Items);

            return page;
        }

        public Page<Comment> GetAllVersions(long id)
        {
            var comment = Context.Comments
                .FirstOrDefault(c => c.Id == id);

            var related = Context.Comments
                .Where(c => c.CorrelationUid == comment.CorrelationUid && c.Id != id)
                .ToPage(0, int.MaxValue, c => c.VersionDate, OrderBy.Asc);

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
                ParentId = commentId,
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
                .Include(c => c.ReactionTypes)
                .FirstOrDefault(c => c.Id == id);

            if (oldComment == null)
            {
                throw new Exception("Comment does not exist.");
            }

            if (oldComment.UserId != userId)
            {
                throw new Exception("Unauthorized.");
            }

            var newComment = new Comment
            {
                UserId = oldComment.UserId,
                ArticleId = oldComment.ArticleId,
                ParentId = oldComment.ParentId,
                Text = text,
                CorrelationUid = oldComment.CorrelationUid,
                VersionDate = DateTime.Now
            };

            Context.Comments.Add(newComment);
            Context.SaveChanges();

            foreach (var child in oldComment.Children)
            {
                child.ParentId = newComment.Id;
                Context.Comments.Update(child);
            }

            foreach (var reactionType in oldComment.ReactionTypes)
            {
                reactionType.CommentId = newComment.Id;
                Context.ReactionTypes.Update(reactionType);
            }

            Context.SaveChanges();

            Context.SetReactionTypes(newComment);

            return newComment;
        }

        public void Delete(long userId, long id)
        {
            var existing = Context.Comments.FirstOrDefault(c => c.Id == id);

            if (existing == null)
            {
                throw new Exception("Comment does not exist.");
            }

            if (existing.UserId != userId)
            {
                throw new Exception("Unauthorized.");
            }

            var allVersions = Context.Comments.Where(c => c.CorrelationUid == existing.CorrelationUid);
            Context.Comments.RemoveRange(allVersions);
            
            Context.SaveChanges();
        }

        
    }
}
