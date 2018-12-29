using CryptoBack.Db;
using CryptoBack.Models;
using CryptoBack.Models.Abstract;
using CryptoBack.Services.Abstract;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CryptoBack.Services
{
    public interface ICategoryService
    {
        IList<Category> GetAll();
        Category Create(byte[] name, long? parentId);
    }

    public class CategoryService : BaseService, ICategoryService
    {
        public CategoryService(Context context) : base(context)
        {

        }

        public IList<Category> GetAll()
        {
            return Context.Categories.IncludeChildren().ToList();
        }

        public Category Create(byte[] name, long? parentId)
        {
            IList<Category> siblings = Context.Categories.Where(c => c.CategoryId == parentId).ToList();

            if (siblings.Any(c => c.Name.UnsafeCompare(name)))
            {
                throw new Exception("Category name already exists.");
            }

            var category = new Category()
            {
                Name = name,
                CategoryId = parentId
            };
            Context.Categories.Add(category);
            Context.SaveChanges();

            return category;
        }
    }
}
