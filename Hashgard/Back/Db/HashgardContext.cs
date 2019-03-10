using Hashgard.Back.Models;
using Microsoft.EntityFrameworkCore;

namespace Hashgard.Back.Db
{
    public class HashgardContext : DbContext
    {
        public HashgardContext(DbContextOptions<HashgardContext> options) : base(options)
        {
        }

        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<Article> Articles { get; set; }
        public virtual DbSet<Reaction> Reactions { get; set; }
        public virtual DbSet<ReactionType> ReactionTypes { get; set; }
        public virtual DbSet<Comment> Comments { get; set; }
        public virtual DbSet<Attachment> Attachments { get; set; }
        public virtual DbSet<ChatMessage> ChatMessages { get; set; }
        public virtual DbSet<ChatView> ChatMessageViews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            var reactionReactionTypeId = nameof(Reaction.ReactionTypeId);
            var reactionUserId = nameof(Reaction.UserId);
            modelBuilder.Entity<Reaction>().HasIndex(reactionReactionTypeId, reactionUserId).IsUnique(true);

            modelBuilder.Entity<Article>()
                .HasMany(c => c.Comments)
                .WithOne(c => c.Article)
                .HasForeignKey(c => c.ArticleId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Article>()
                .HasMany(a => a.ReactionTypes)
                .WithOne(rt => rt.Article)
                .HasForeignKey(rt => rt.ArticleId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Comment>()
                .HasMany(c => c.Children)
                .WithOne(c => c.Parent)
                .HasForeignKey(c => c.ParentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Comment>()
                .HasMany(c => c.ReactionTypes)
                .WithOne(c => c.Comment)
                .HasForeignKey(c => c.CommentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ReactionType>()
                .HasMany(rt => rt.Reactions)
                .WithOne(r => r.ReactionType)
                .HasForeignKey(r => r.ReactionTypeId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
