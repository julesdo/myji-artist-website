import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { checkAuth } from "./auth";

export const get = query({
  args: { type: v.optional(v.union(v.literal("artwork"), v.literal("post"))) },
  handler: async (ctx, args) => {
    if (args.type) {
      return await ctx.db
        .query("categories")
        .withIndex("by_type", (q) => q.eq("type", args.type!))
        .collect();
    }
    return await ctx.db.query("categories").collect();
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    type: v.union(v.literal("artwork"), v.literal("post")),
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await checkAuth(ctx, args.token);
    const existing = await ctx.db
      .query("categories")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .filter((q) => q.eq(q.field("name"), args.name))
      .first();
    
    if (existing) return existing._id;
    
    return await ctx.db.insert("categories", {
      name: args.name,
      type: args.type,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("categories"), token: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await checkAuth(ctx, args.token);
    await ctx.db.delete(args.id);
  },
});
