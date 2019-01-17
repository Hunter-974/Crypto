using Crypto.Back.Db;
using Crypto.Back.Models;
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
        IList<Article> GetAllVersions(long id);
        Article Create(long userId, long categoryId, string title, string text);
        Article Edit(long userId, long id, string newTitle, string newText);
    }

    public class ArticleService : BaseService, IArticleService
    {
        public ArticleService(Context context) : base(context)
        {

        }

        public Page<Article> GetList(long categoryId, int index, int count)
        {
            var list = Context.Articles.Where(a => a.CategoryId == categoryId).Skip(index).Take(count)
                .Include(a => a.User).ToList();

            var totalCount = Context.Articles.Count(a => a.CategoryId == categoryId);

            foreach (var article in list)
            {
                article.Text = null;
                SetReactionCounts(article);
            }

            return new Page<Article>
            {
                Items = list,
                Index = index,
                Count = count,
                TotalCount = totalCount
            };
        }

        public Article Get(long id)
        {
            var article = Context.Articles.Include(a => a.User).FirstOrDefault(a => a.Id == id);

            SetReactionCounts(article);

            return article;
        }

        public IList<Article> GetAllVersions(long id)
        {
            var article = Get(id);
            var related = Context.Articles
                .Where(a => a.CorrelationUid == article.CorrelationUid)
                .OrderByDescending(a => a.VersionDate)
                .ToList();
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

            if (existing != null)
            {
                throw new Exception("Article does not exist.");
            }

            var article = existing;

            if (existing.Title == newTitle || existing.Text == newText)
            {
                article = new Article()
                {
                    UserId = userId,
                    CategoryId = existing.CategoryId,
                    CorrelationUid = existing.CorrelationUid,
                    Title = newTitle,
                    Text = newText,
                    VersionDate = DateTime.Now
                };
                Context.Articles.Add(article);

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
            }
            else
            {
                article = existing;
            }

            SetReactionCounts(article);
            
            return article;
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
