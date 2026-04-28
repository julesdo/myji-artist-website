import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { checkAuth } from "./auth";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const artworks = await ctx.db.query("artworks").collect();
    return Promise.all(
      artworks.map(async (artwork) => ({
        ...artwork,
        imageUrl: artwork.imageUrl.startsWith("http") 
          ? artwork.imageUrl 
          : (await ctx.storage.getUrl(artwork.imageUrl)) ?? artwork.imageUrl,
        gallery: artwork.gallery ? await Promise.all(
          artwork.gallery.map(async (id) => (await ctx.storage.getUrl(id)) ?? id)
        ) : [],
      }))
    );
  },
});

export const getById = query({
  args: { id: v.id("artworks") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const add = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    series: v.string(),
    year: v.string(),
    medium: v.string(),
    dimensions: v.string(),
    description: v.string(),
    imageUrl: v.string(),
    gallery: v.optional(v.array(v.string())),
    featured: v.boolean(),
    category: v.optional(v.string()),
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await checkAuth(ctx, args.token);
    const { token, ...data } = args;
    await ctx.db.insert("artworks", data);
  },
});

export const update = mutation({
  args: {
    id: v.id("artworks"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    series: v.optional(v.string()),
    year: v.optional(v.string()),
    medium: v.optional(v.string()),
    dimensions: v.optional(v.string()),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    gallery: v.optional(v.array(v.string())),
    featured: v.optional(v.boolean()),
    category: v.optional(v.string()),
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await checkAuth(ctx, args.token);
    const { id, token, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const deleteArtwork = mutation({
  args: { id: v.id("artworks"), token: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await checkAuth(ctx, args.token);
    await ctx.db.delete(args.id);
  },
});
