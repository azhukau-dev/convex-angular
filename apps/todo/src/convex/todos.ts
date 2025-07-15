import { v } from 'convex/values';

import { query } from './_generated/server';

export const listTodos = query({
  args: {
    count: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.query('todos').take(args.count);
  },
});
