using Hashgard.Back.Db;
using Hashgard.Back.Models;
using Hashgard.Back.Services.Abstract;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Hashgard.Back.Services
{
    public interface ICategoryService
    {
        IList<Category> GetParents();
        IList<Category> GetChildren(long parentId);
        Category Create(long userId, string name, long? parentId);
    }

    public class CategoryService : BaseService, ICategoryService
    {
        public CategoryService(HashgardContext context) : base(context)
        {

        }

        public IList<Category> GetParents()
        {
            return HashgardContext.Categories.Where(c => c.ParentId == null).ToList();
        }

        public IList<Category> GetChildren(long parentId)
        {
            return HashgardContext.Categories.Where(c => c.ParentId == parentId).ToList();
        }

        public Category Create(long userId, string name, long? parentId)
        {
            var category = new Category()
            {
                Name = name,
                ParentId = parentId,
                UserId = userId
            };
            HashgardContext.Categories.Add(category);
            HashgardContext.SaveChanges();

            return category;
        }
    }
}
