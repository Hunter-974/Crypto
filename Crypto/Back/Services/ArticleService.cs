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
    public interface IArticleService
    {
        Page<Article> GetList(long categoryId, int index, int count);
        Article Get(long id);
        Page<Article> GetAllVersions(long id);
        Article Create(long userId, long categoryId, string title, string text);
        Article Edit(long userId, long id, string newTitle, string newText);
        void Delete(long userId, long id);
    }

    public class ArticleService : BaseService, IArticleService
    {
        public ArticleService(Context context) : base(context)
        {

        }

        public Page<Article> GetList(long categoryId, int index, int count)
        {
            var page = Context.Articles.Where(a => a.CategoryId == categoryId).Include(a => a.User)
                .GetLastVersions().ToPage(index, count, a => a.VersionDate, OrderBy.Desc);

            var totalCount = Context.Articles.Count(a => a.CategoryId == categoryId);

            foreach (var article in page.Items)
            {
                article.Text = null;
                SetReactionCounts(article);
            }

            return page;
        }

        public Article Get(long id)
        {
            var article = Context.Articles.Include(a => a.User).FirstOrDefault(a => a.Id == id);

            SetReactionCounts(article);

            return article;
        }

        public Page<Article> GetAllVersions(long id)
        {
            var article = Get(id);
            var related = Context.Articles
                .Where(a => a.CorrelationUid == article.CorrelationUid)
                .ToPage(0, int.MaxValue, a => a.VersionDate, OrderBy.Asc);
            return related;
        }

        public Article Create(long userId, long categoryId, string title, string text)
        {
            var existing = Context.Articles.FirstOrDefault(a => a.CategoryId == categoryId && a.Title == title);
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
            Context.Articles.Add(article);
            Context.SaveChanges();

            return article;
        }

        public Article Edit(long userId, long id, string newTitle, string newText)
        {
            var existing = Context.Articles
                .Include(a => a.Comments)
                .Include(a => a.Reactions)
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
            Context.Articles.Add(article);

            Context.SaveChanges();

            foreach (var comment in existing.Comments)
            {
                comment.ArticleId = article.Id;
                Context.Comments.Update(comment);
            }

            foreach (var reaction in existing.Reactions)
            {
                reaction.ArticleId = article.Id;
                Context.Reactions.Update(reaction);
            }

            Context.SaveChanges();

            SetReactionCounts(article);
            
            return article;
        }

        public void Delete(long userId, long id)
        {
            var existing = Context.Articles.FirstOrDefault(a => a.Id == id);

            if (existing == null)
            {
                throw new Exception("Article does not exist.");
            }

            if (existing.UserId != userId)
            {
                throw new Exception("Unauthorized.");
            }

            var allVersions = Context.Articles.Where(a => a.CorrelationUid == existing.CorrelationUid);
            Context.Articles.RemoveRange(allVersions);
            Context.SaveChanges();
        }

        private void SetReactionCounts(Article article)
        {
            var reactionCounts = Context.Reactions
                .Where(r => r.ArticleId == article.Id)
                .GroupBy(r => r.ReactionType)
                .Select(g => new ReactionCount() {ReactionType = g.Key, Count = g.Count()})
                .ToList();
            article.ReactionCounts = reactionCounts;
        }
    }
}
