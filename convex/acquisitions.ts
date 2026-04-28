import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("acquisitions").collect();
  },
});

export const submit = mutation({
  args: {
    type: v.union(v.literal("acquisition"), v.literal("commission")),
    artworkId: v.optional(v.id("artworks")),
    artworkTitle: v.optional(v.string()),
    clientName: v.string(),
    clientEmail: v.string(),
    clientPhone: v.optional(v.string()),
    message: v.string(),
    details: v.optional(v.object({
      dimensions: v.optional(v.string()),
      colorPalette: v.optional(v.string()),
      deadline: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("acquisitions", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("acquisitions"),
    status: v.union(v.literal("pending"), v.literal("discussion"), v.literal("approved"), v.literal("paid"), v.literal("delivered"), v.literal("cancelled")),
    price: v.optional(v.number()),
    paymentLink: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: { id: v.id("acquisitions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
