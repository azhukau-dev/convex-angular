import { internal } from './_generated/api';
import { action } from './_generated/server';

export const completeAllTodos = action({
  handler: async (ctx) => {
    await ctx.runMutation(internal.todos.completeAllTodos);
  },
});

export const reopenAllTodos = action({
  handler: async (ctx) => {
    await ctx.runMutation(internal.todos.reopenAllTodos);
  },
});
