using Hashgard.Back.Db;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace Hashgard.Back.Models.Abstract
{
    public interface IReactionTypes
    {
        IList<ReactionType> ReactionTypes { get; set; }
    }

    public static class IReactionTypesExtensions
    {
        public static void SetReactionTypes<TEntity>(this DbContext context, TEntity entity,
            long? userId, Expression<Func<ReactionType, long?>> entityIdSelector)
            where TEntity : Entity, IReactionTypes
        {
            context.SetReactionTypes<TEntity>(new[] { entity }, userId, entityIdSelector);
        }

        public static void SetReactionTypes<TEntity>(this DbContext context, IEnumerable<TEntity> entityList,
            long? userId, Expression<Func<ReactionType, long?>> entityIdSelector)
            where TEntity : Entity, IReactionTypes
        {
            var compiledEntitySelector = entityIdSelector.Compile();
            var entityIds = entityList.Select(e => e.Id).ToArray();
            var e1 = context.Set<ReactionType>();
            var e2 = e1.Where(rt => compiledEntitySelector(rt).HasValue && entityIds.Contains(compiledEntitySelector(rt).Value));
            var e3 = e2.Include(rt => rt.Reactions);
            var e4 = e3.GroupBy(entityIdSelector);
            var reactionTypeDicts = e4.ToDictionary(gr => gr?.Key.Value, gr => gr?.ToList());

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
