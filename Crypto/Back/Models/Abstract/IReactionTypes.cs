using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Crypto.Back.Models.Abstract
{
    public interface IReactionTypes
    {
        IList<ReactionType> ReactionTypes { get; set; }
    }

    public static class IReactionTypesExtensions
    {
        public static void SetReactionTypes<TEntity>(this DbContext context, TEntity entity)
            where TEntity : Entity, IReactionTypes
        {
            context.SetReactionTypes<TEntity>(new List<TEntity>() { entity });
        }

        public static void SetReactionTypes<TEntity>(this DbContext context, IEnumerable<TEntity> entityList)
            where TEntity : Entity, IReactionTypes
        {
            var ids = entityList.Select(e => e.Id).ToArray();
            var reactionTypeGroups = context.Set<ReactionType>()
                .Where(rt => ids.Contains(rt.Id))
                .Include(rt => rt.Reactions)
                .GroupBy(rt => rt.CommentId);

            foreach (var reactionTypeGroup in reactionTypeGroups)
            {
                var entity = entityList.Single(c => c.Id == reactionTypeGroup.Key);
                entity.ReactionTypes = reactionTypeGroup
                    .OrderByDescending(rt => rt.Reactions.Count())
                    .ToList();

                foreach (var reactionType in entity.ReactionTypes)
                {
                    reactionType.ReactionCount = reactionType.Reactions.Count();
                }
            }
        }
    }

    
}
