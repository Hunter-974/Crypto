using Crypto.Back.Db;
using Crypto.Back.Models;
using Crypto.Back.Services.Abstract;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Crypto.Back.Services
{
    public interface ICategoryService
    {
        IList<Category> GetParents();
        IList<Category> GetChildren(long parentId);
        Category Create(long userId, string name, long? parentId);
    }

    public class CategoryService : BaseService, ICategoryService
    {
        public CategoryService(CryptoDbContext context) : base(context)
        {

        }

        public IList<Category> GetParents()
        {
            return CryptoDbContext.Categories.Where(c => c.ParentId == null).ToList();
        }

        public IList<Category> GetChildren(long parentId)
        {
            return CryptoDbContext.Categories.Where(c => c.ParentId == parentId).ToList();
        }

        public Category Create(long userId, string name, long? parentId)
        {
            var category = new Category()
            {
                Name = name,
                ParentId = parentId,
                UserId = userId
            };
            CryptoDbContext.Categories.Add(category);
            CryptoDbContext.SaveChanges();

            return category;
        }
    }
}
