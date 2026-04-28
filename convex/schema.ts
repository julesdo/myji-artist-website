import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Sync trigger
export default defineSchema({
  artworks: defineTable({
    title: v.string(),
    slug: v.optional(v.string()),
    series: v.string(),
    year: v.string(),
    medium: v.string(),
    dimensions: v.string(),
    description: v.string(),
    imageUrl: v.string(), // Main image
    gallery: v.optional(v.array(v.string())), // Additional images
    featured: v.boolean(),
    category: v.optional(v.string()),
  }).index("by_slug", ["slug"]),
  posts: defineTable({
    title: v.string(),
    slug: v.optional(v.string()),
    date: v.string(),
    excerpt: v.string(),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    category: v.optional(v.string()),
  }).index("by_slug", ["slug"]),
  acquisitions: defineTable({
    type: v.union(v.literal("acquisition"), v.literal("commission")),
    status: v.union(v.literal("pending"), v.literal("discussion"), v.literal("approved"), v.literal("paid"), v.literal("delivered"), v.literal("cancelled")),
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
    price: v.optional(v.number()),
    paymentLink: v.optional(v.string()),
    createdAt: v.number(),
  }),
  categories: defineTable({
    name: v.string(),
    type: v.union(v.literal("artwork"), v.literal("post")),
  }).index("by_type", ["type"]),
  series: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    year: v.optional(v.string()),
  }).index("by_title", ["title"]),
  settings: defineTable({
    key: v.string(),
    value: v.any(),
  }),
  // Force sync comment
  admins: defineTable({
    email: v.string(),
    passwordHash: v.string(),
    lastLogin: v.optional(v.number()),
  }).index("by_email", ["email"]),
  sessions: defineTable({
    token: v.string(),
    adminId: v.id("admins"),
    expiresAt: v.number(),
  }).index("by_token", ["token"]),
});
