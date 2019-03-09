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
    public interface IArticleService
    {
        Page<Article> GetList(long? userId, long categoryId, int index, int count);
        Article Get(long? userId, long id);
        Page<Article> GetAllVersions(long id);
        Task<Article> CreateAsync(long userId, long categoryId, string title, string text);
        Task<Article> EditAsync(long userId, long id, string newTitle, string newText);
        Task DeleteAsync(long userId, long id);
    }

    public class ArticleService : BaseService, IArticleService
    {
        public ArticleService(HashgardContext context) : base(context)
        {

        }

        public Page<Article> GetList(long? userId, long categoryId, int index, int count)
        {
            var page = HashgardContext.Articles
                .Where(a => a.CategoryId == categoryId)
                .Include(a => a.User)
                .GetLastVersions()
                .ToPage(index, count, a => a.VersionDate, OrderBy.Desc);

            var totalCount = HashgardContext.Articles.Count(a => a.CategoryId == categoryId);

            HashgardContext.SetReactionTypes<Article>(page.Items, userId, rt => rt.ArticleId);

            return page;
        }

        public Article Get(long? userId, long id)
        {
            var article = HashgardContext.Articles.Include(a => a.User).ForId(id);

            HashgardContext.SetReactionTypes(article, userId, rt => rt.ArticleId);

            return article;
        }

        public Page<Article> GetAllVersions(long id)
        {
            var article = HashgardContext.Articles.ForId(id);

            var related = HashgardContext.Articles
                .Where(a => a.CorrelationUid == article.CorrelationUid)
                .ToPage(0, int.MaxValue, a => a.VersionDate, OrderBy.Asc);
            return related;
        }

        public async Task<Article> CreateAsync(long userId, long categoryId, string title, string text)
        {
            using (var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var existing = HashgardContext.Articles.FirstOrDefault(a => a.CategoryId == categoryId && a.Title == title);
                if (existing != null)
                {
                    throw new Exception("Article title already exists.");
                }

                var article = new Article
                {
                    UserId = userId,
                    CategoryId = categoryId,
                    Title = title,
                    Text = text,
                    CorrelationUid = Guid.NewGuid(),
                    VersionDate = DateTime.Now
                };
                HashgardContext.Articles.Add(article);

                await HashgardContext.SaveChangesAsync();

                transaction.Complete();

                return article;
            }
        }

        public async Task<Article> EditAsync(long userId, long id, string newTitle, string newText)
        {
            using (var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var existing = HashgardContext.Articles
                .Include(a => a.Comments)
                .Include(a => a.ReactionTypes)
                .FirstOrDefault(a => a.Id == id);

                if (existing == null)
                {
                    throw new Exception("Article does not exist.");
                }

                if (existing.UserId != userId)
                {
                    throw new Exception("Unauthorized.");
                }

                var article = new Article()
                {
                    UserId = userId,
                    CategoryId = existing.CategoryId,
                    CorrelationUid = existing.CorrelationUid,
                    Title = newTitle,
                    Text = newText,
                    VersionDate = DateTime.Now
                };
                HashgardContext.Articles.Add(article);

                await HashgardContext.SaveChangesAsync();

                foreach (var comment in existing.Comments)
                {
                    comment.ArticleId = article.Id;
                    HashgardContext.Comments.Update(comment);
                }

                foreach (var reactionType in existing.ReactionTypes)
                {
                    reactionType.ArticleId = article.Id;
                    HashgardContext.ReactionTypes.Update(reactionType);
                }

                await HashgardContext.SaveChangesAsync();

                HashgardContext.SetReactionTypes(article, userId, rt => rt.ArticleId);

                transaction.Complete();

                return article;
            }
        }

        public async Task DeleteAsync(long userId, long id)
        {
            using (var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var existing = HashgardContext.Articles
                    .Include(a => a.Comments).ThenInclude(c => c.Children)
                    .ForId(id);

                if (existing == null)
                {
                    throw new Exception("Article does not exist.");
                }

                if (existing.UserId != userId)
                {
                    throw new Exception("Unauthorized.");
                }

                var children = existing.Comments
                    .Union(existing.Comments.SelectMany(c => c.Children));
                HashgardContext.Comments.RemoveRange(children);

                var allVersions = HashgardContext.Articles.Where(a => a.CorrelationUid == existing.CorrelationUid);
                HashgardContext.Articles.RemoveRange(allVersions);

                await HashgardContext.SaveChangesAsync();

                transaction.Complete();
            }
        }
    }
}
