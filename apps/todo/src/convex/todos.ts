import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const listTodos = query({
  args: {
    count: v.number(),
  },
  handler: async (ctx, args) => {
    const { count } = args;
    return await ctx.db.query('todos').take(count);
  },
});

export const completeTodo = mutation({
  args: {
    id: v.id('todos'),
  },
  handler: async (ctx, args) => {
    const { id } = args;
    await ctx.db.patch(id, { completed: true });
  },
});

export const reopenTodo = mutation({
  args: {
    id: v.id('todos'),
  },
  handler: async (ctx, args) => {
    const { id } = args;
    await ctx.db.patch(id, { completed: false });
  },
});
