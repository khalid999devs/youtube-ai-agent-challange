import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: {
    videoId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('titles')
      .withIndex('by_user_and_video_id', (q) =>
        q.eq('userId', args.userId).eq('videoId', args.videoId)
      )
      .collect();
  },
});

export const generate = mutation({
  args: {
    videoId: v.string(),
    userId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const titleId = await ctx.db.insert('titles', {
      videoId: args.videoId,
      userId: args.userId,
      title: args.title,
    });
    return titleId;
  },
});
