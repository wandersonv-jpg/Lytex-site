import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(role: AuthenticatedUser["role"]): TrpcContext {
  return {
    user: {
      id: 8,
      openId: "lytex-test-user",
      email: "admin@example.com",
      name: "Lytex Admin",
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("portfolio admin permissions", () => {
  it("blocks catalog updates from regular users", async () => {
    const caller = appRouter.createCaller(createContext("user"));

    await expect(caller.portfolio.update({
      id: 1,
      title: "Tentativa não autorizada",
    })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
