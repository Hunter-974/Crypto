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
        public CategoryService(Context context) : base(context)
        {

        }

        public IList<Category> GetParents()
        {
            return Context.Categories.Where(c => c.CategoryId == null).ToList();
        }

        public IList<Category> GetChildren(long parentId)
        {
            return Context.Categories.Where(c => c.CategoryId == parentId).ToList();
        }

        public Category Create(long userId, string name, long? parentId)
        {
            var category = new Category()
            {
                Name = name,
                CategoryId = parentId,
                UserId = userId
            };
            Context.Categories.Add(category);
            Context.SaveChanges();

            return category;
        }
    }
}
