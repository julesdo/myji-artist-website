import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";
import { internalMutation } from "./_generated/server";

// SCRIPT: Run this from Convex Dashboard to initialize an admin
// Mutation name: auth:createAdmin
export const createAdmin = mutation({
  args: { 
    email: v.string(), 
    password: v.string() 
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("admins")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (existing) throw new Error("Admin already exists");

    const passwordHash = bcrypt.hashSync(args.password, 10);
    const adminId = await ctx.db.insert("admins", {
      email: args.email,
      passwordHash,
    });

    return { success: true, adminId };
  },
});

export const login = mutation({
  args: { 
    email: v.string(), 
    password: v.string() 
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!admin) {
      throw new Error("Identifiants incorrects");
    }

    const isValid = bcrypt.compareSync(args.password, admin.passwordHash);
    if (!isValid) {
      throw new Error("Identifiants incorrects");
    }

    // Create session
    const token = [...Array(32)].map(() => Math.random().toString(36)[2]).join("");
    const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days

    const sessionId = await ctx.db.insert("sessions", {
      token,
      adminId: admin._id,
      expiresAt,
    });

    await ctx.db.patch(admin._id, { lastLogin: Date.now() });

    return { token, email: admin.email };
  },
});

export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    
    if (session) {
      await ctx.db.delete(session._id);
    }
  },
});

export const checkSession = query({
  args: { token: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.token) return null;
    
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    
    if (!session || session.expiresAt < Date.now()) {
      return null;
    }

    const admin = await ctx.db.get(session.adminId);
    if (!admin) return null;

    return { email: admin.email };
  },
});

// Helper for other mutations to check auth
export async function checkAuth(ctx: any, token?: string) {
  if (!token) throw new Error("Non autorisé");
  
  const session = await ctx.db
    .query("sessions")
    .withIndex("by_token", (q: any) => q.eq("token", token))
    .first();
  
  if (!session || session.expiresAt < Date.now()) {
    throw new Error("Session expirée ou invalide");
  }

  return session;
}
