using CryptoBack.Db;
using CryptoBack.Models;
using CryptoBack.Services.Abstract;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CryptoBack.Services
{
    public interface IArticleService
    {
        IList<Article> GetList(long categoryId, int index, int count);
        Article Get(long id);
        IList<Article> GetAllVersions(long id);
        Article Create(long userId, long categoryId, byte[] title, byte[] text);
        Article Edit(long userId, long id, byte[] newTitle, byte[] newText);
    }

    public class ArticleService : BaseService, IArticleService
    {
        public ArticleService(Context context) : base(context)
        {

        }

        public IList<Article> GetList(long categoryId, int index, int count)
        {
            var list = Context.Articles.Where(a => a.CategoryId == categoryId).Skip(index).Take(count).ToList();
            foreach (var article in list)
            {
                article.Text = null;
            }
            return list;
        }

        public Article Get(long id)
        {
            var article = Context.Articles.FirstOrDefault(a => a.Id == id);
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

        public Article Create(long userId, long categoryId, byte[] title, byte[] text)
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

        public Article Edit(long userId, long id, byte[] newTitle, byte[] newText)
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

            if (existing.Title.UnsafeCompare(newTitle) || existing.Text.UnsafeCompare(newText))
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
            
            return article;
        }
    }
}
