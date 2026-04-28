import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { checkAuth } from "./auth";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("settings").collect();
    // Convert array to object for easier client-side use
    return settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, any>);
  },
});

export const update = mutation({
  args: {
    key: v.string(),
    value: v.any(),
    token: v.optional(v.string()), // Made optional for transition but should be enforced
  },
  handler: async (ctx, args) => {
    await checkAuth(ctx, args.token);
    
    const existing = await ctx.db
      .query("settings")
      .filter((q) => q.eq(q.field("key"), args.key))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { value: args.value });
    } else {
      await ctx.db.insert("settings", { key: args.key, value: args.value });
    }
  },
});
