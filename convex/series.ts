import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { checkAuth } from "./auth";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const series = await ctx.db.query("series").collect();
    return Promise.all(
      series.map(async (s) => ({
        ...s,
        imageUrl: s.imageUrl 
          ? (s.imageUrl.startsWith("http") ? s.imageUrl : (await ctx.storage.getUrl(s.imageUrl)) ?? s.imageUrl)
          : undefined,
      }))
    );
  },
});

export const getByTitle = query({
  args: { title: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("series")
      .withIndex("by_title", (q) => q.eq("title", args.title))
      .first();
  },
});

export const add = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    year: v.optional(v.string()),
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await checkAuth(ctx, args.token);
    const { token, ...data } = args;
    
    const existing = await ctx.db
      .query("series")
      .withIndex("by_title", (q) => q.eq("title", args.title))
      .first();
    
    if (existing) {
      await ctx.db.patch(existing._id, data);
      return existing._id;
    }
    
    return await ctx.db.insert("series", data);
  },
});

export const update = mutation({
  args: {
    id: v.id("series"),
    title: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    year: v.optional(v.string()),
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await checkAuth(ctx, args.token);
    const { id, token, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const remove = mutation({
  args: { id: v.id("series"), token: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await checkAuth(ctx, args.token);
    await ctx.db.delete(args.id);
  },
});
