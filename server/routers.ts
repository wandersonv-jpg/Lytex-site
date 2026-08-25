import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { createPortfolioItem, listPortfolioItems, updatePortfolioItem } from "./db";
import { storagePut } from "./storage";

const portfolioUpdateInput = z.object({
  id: z.number().int().positive(),
  tag: z.string().trim().min(1).max(120).optional(),
  title: z.string().trim().min(1).max(160).optional(),
  description: z.string().trim().min(1).max(2000).optional(),
  category: z.string().trim().min(1).max(80).optional(),
  imageUrl: z.string().trim().url().or(z.string().trim().startsWith("/manus-storage/")).optional(),
  sortOrder: z.number().int().min(0).max(999).optional(),
  isVisible: z.number().int().min(0).max(1).optional(),
});

const uploadImageInput = z.object({
  fileName: z.string().trim().min(1).max(180),
  contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  dataBase64: z.string().min(100).max(14_000_000),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  portfolio: router({
    list: publicProcedure.query(() => listPortfolioItems(false)),
    listAdmin: adminProcedure.query(() => listPortfolioItems(true)),
    update: adminProcedure.input(portfolioUpdateInput).mutation(({ input }) => {
      const { id, ...values } = input;
      return updatePortfolioItem(id, values);
    }),
    uploadImage: adminProcedure.input(uploadImageInput).mutation(async ({ input, ctx }) => {
      const normalizedName = input.fileName.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
      const base64 = input.dataBase64.replace(/^data:[^;]+;base64,/, "");
      const buffer = Buffer.from(base64, "base64");
      if (buffer.byteLength > 10 * 1024 * 1024) {
        throw new Error("A imagem deve ter no máximo 10 MB");
      }
      const stored = await storagePut(`portfolio/${ctx.user.id}/${Date.now()}-${normalizedName}`, buffer, input.contentType);
      return stored;
    }),
    create: adminProcedure.input(z.object({
      slug: z.string().trim().min(1).max(120).regex(/^[a-z0-9-]+$/),
      category: z.string().trim().min(1).max(80),
      tag: z.string().trim().min(1).max(120),
      title: z.string().trim().min(1).max(160),
      description: z.string().trim().min(1).max(2000),
      imageUrl: z.string().trim().url().or(z.string().trim().startsWith("/manus-storage/")),
      sortOrder: z.number().int().min(0).max(999).default(0),
      isVisible: z.number().int().min(0).max(1).default(1),
    })).mutation(({ input }) => createPortfolioItem(input)),
  }),
});

export type AppRouter = typeof appRouter;
