using Hashgard.Back.Db;
using Hashgard.Back.Models;
using Hashgard.Back.Models.Abstract;
using Hashgard.Back.Services.Abstract;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Hashgard.Back.Services
{
    public interface IArticleService
    {
        Page<Article> GetList(long? userId, long categoryId, int index, int count);
        Article Get(long? userId, long id);
        Page<Article> GetAllVersions(long id);
        Article Create(long userId, long categoryId, string title, string text);
        Article Edit(long userId, long id, string newTitle, string newText);
        void Delete(long userId, long id);
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

        public Article Create(long userId, long categoryId, string title, string text)
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
            HashgardContext.SaveChanges();

            return article;
        }

        public Article Edit(long userId, long id, string newTitle, string newText)
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

            HashgardContext.SaveChanges();

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

            HashgardContext.SaveChanges();

            HashgardContext.SetReactionTypes(article, userId, rt => rt.ArticleId);
            
            return article;
        }

        public void Delete(long userId, long id)
        {
            var existing = HashgardContext.Articles.ForId(id);

            if (existing == null)
            {
                throw new Exception("Article does not exist.");
            }

            if (existing.UserId != userId)
            {
                throw new Exception("Unauthorized.");
            }

            var allVersions = HashgardContext.Articles.Where(a => a.CorrelationUid == existing.CorrelationUid);
            HashgardContext.Articles.RemoveRange(allVersions);
            HashgardContext.SaveChanges();
        }
    }
}
