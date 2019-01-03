using CryptoBack.Models;
using Microsoft.EntityFrameworkCore;

namespace CryptoBack.Db
{
    public class Context : DbContext
    {
        public Context(DbContextOptions<Context> options) : base(options)
        {

        }

        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<Article> Articles { get; set; }
        public virtual DbSet<Reaction> Reactions { get; set; }
        public virtual DbSet<Comment> Comments { get; set; }
        public virtual DbSet<Attachment> Attachments { get; set; }

    }
}
