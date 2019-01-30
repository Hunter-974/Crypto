using Crypto.Back.Db;
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
        public static void SetReactionTypes<TEntity>(this DbContext context, TEntity entity,
            long? userId, Func<ReactionType, long?> entityIdSelector)
            where TEntity : Entity, IReactionTypes
        {
            context.SetReactionTypes<TEntity>(new[] { entity }, userId, entityIdSelector);
        }

        public static void SetReactionTypes<TEntity>(this DbContext context, IEnumerable<TEntity> entityList,
            long? userId, Func<ReactionType, long?> entityIdSelector)
            where TEntity : Entity, IReactionTypes
        {
            var ids = entityList.Select(e => e.Id).ToArray();
            var reactionTypeDicts = context.Set<ReactionType>()
                .Where(rt => ids.Contains(rt.Id))
                .Include(rt => rt.Reactions)
                .GroupBy(rt => entityIdSelector(rt))
                .ToDictionary(gr => gr.Key, gr => gr.ToList());

            foreach (var entity in entityList)
            {
                if (reactionTypeDicts.TryGetValue(entity.Id, out var reactionTypes))
                {
                    entity.ReactionTypes = reactionTypes
                        .OrderByDescending(rt => rt.Reactions.Count())
                        .ToList();

                    foreach (var reactionType in entity.ReactionTypes)
                    {
                        reactionType.ReactionCount = reactionType.Reactions.Count();

                        if (userId.HasValue)
                        {
                            reactionType.HasUserReacted = reactionType
                                .Reactions.Any(r => r.UserId == userId.Value);
                        }
                    }
                }
                else
                {
                    entity.ReactionTypes = new List<ReactionType>();
                }
            }
        }

    }
}
