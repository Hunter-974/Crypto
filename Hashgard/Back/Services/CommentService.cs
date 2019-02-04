using Hashgard.Back.Db;
using Hashgard.Back.Models;
using Hashgard.Back.Models.Abstract;
using Hashgard.Back.Services.Abstract;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Transactions;

namespace Hashgard.Back.Services
{
    public interface ICommentService
    {
        Page<Comment> GetListForArticle(long? userId, long articleId, int index, int count);
        Page<Comment> GetListForComment(long? userId, long commentId, int index, int count);
        Page<Comment> GetAllVersions(long id);
        Task<Comment> CreateForArticleAsync(long userId, long articleId, string text);
        Task<Comment> CreateForCommentAsync(long userId, long commentId, string text);
        Task<Comment> EditAsync(long userId, long id, string text);
        Task DeleteAsync(long userId, long id);
    }

    public class CommentService : BaseService, ICommentService
    {
        public CommentService(HashgardContext context) : base(context)
        {
        }

        public Page<Comment> GetListForArticle(long? userId, long articleId, int index, int count)
        {
            return GetList(userId, articleId, null, index, count);
        }

        public Page<Comment> GetListForComment(long? userId, long commentId, int index, int count)
        {
            return GetList(userId, null, commentId, index, count);
        }

        private Page<Comment> GetList(long? userId, long? articleId, long? commentId, int index, int count)
        {
            var page = HashgardContext.Comments
                .Where(c => c.ArticleId == articleId && c.ParentId == commentId)
                .Include(c => c.User)
                .GetLastVersions()
                .ToPage(index, count, c => c.VersionDate, OrderBy.Desc);
            
            HashgardContext.SetReactionTypes<Comment>(page.Items, userId, rt => rt.CommentId);

            return page;
        }

        public Page<Comment> GetAllVersions(long id)
        {
            var comment = HashgardContext.Comments.ForId(id);

            var related = HashgardContext.Comments
                .Where(c => c.CorrelationUid == comment.CorrelationUid && c.Id != id)
                .ToPage(0, int.MaxValue, c => c.VersionDate, OrderBy.Asc);

            return related;
        }

        public Task<Comment> CreateForArticleAsync(long userId, long articleId, string text)
        {
            return AddAsync(userId, articleId, null, text);
        }

        public Task<Comment> CreateForCommentAsync(long userId, long commentId, string text)
        {
            return AddAsync(userId, null, commentId, text);
        }

        private async Task<Comment> AddAsync(long userId, long? articleId, long? commentId, string text)
        {
            using (var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
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

                HashgardContext.Comments.Add(comment);

                await HashgardContext.SaveChangesAsync();

                transaction.Complete();

                return comment;
            }
        }

        public async Task<Comment> EditAsync(long userId, long id, string text)
        {
            using (var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var oldComment = HashgardContext.Comments
                    .Include(c => c.Children)
                    .Include(c => c.ReactionTypes)
                    .ForId(id);

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

                HashgardContext.Comments.Add(newComment);
                await HashgardContext.SaveChangesAsync();

                foreach (var child in oldComment.Children)
                {
                    child.ParentId = newComment.Id;
                    HashgardContext.Comments.Update(child);
                }

                foreach (var reactionType in oldComment.ReactionTypes)
                {
                    reactionType.CommentId = newComment.Id;
                    HashgardContext.ReactionTypes.Update(reactionType);
                }

                await HashgardContext.SaveChangesAsync();

                HashgardContext.SetReactionTypes(newComment, userId, rt => rt.CommentId);

                transaction.Complete();

                return newComment;
            }
        }

        public async Task DeleteAsync(long userId, long id)
        {
            using (var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var existing = HashgardContext.Comments
                    .Include(c => c.Children)
                    .ForId(id);

                if (existing == null)
                {
                    throw new Exception("Comment does not exist.");
                }

                if (existing.UserId != userId)
                {
                    throw new Exception("Unauthorized.");
                }
                
                HashgardContext.Comments.RemoveRange(
                    existing.Children);

                var allVersions = HashgardContext.Comments.Where(c => c.CorrelationUid == existing.CorrelationUid);
                HashgardContext.Comments.RemoveRange(
                    allVersions);

                await HashgardContext.SaveChangesAsync();
                transaction.Complete();
            }
        }

        
    }
}
