import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { checkAuth } from "./auth";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").collect();
    return Promise.all(
      posts.map(async (post) => ({
        ...post,
        imageUrl: post.imageUrl 
          ? (post.imageUrl.startsWith("http") ? post.imageUrl : (await ctx.storage.getUrl(post.imageUrl)) ?? post.imageUrl)
          : undefined,
      }))
    );
  },
});

export const add = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    date: v.string(),
    excerpt: v.string(),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    category: v.optional(v.string()),
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await checkAuth(ctx, args.token);
    const { token, ...data } = args;
    await ctx.db.insert("posts", data);
  },
});

export const update = mutation({
  args: {
    id: v.id("posts"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    date: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    content: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    category: v.optional(v.string()),
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await checkAuth(ctx, args.token);
    const { id, token, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const deletePost = mutation({
  args: { id: v.id("posts"), token: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await checkAuth(ctx, args.token);
    await ctx.db.delete(args.id);
  },
});
