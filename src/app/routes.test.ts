import { describe, expect, it } from "vitest";

import { FUTURE_PROTECTED_AREAS, PRIVATE_ROUTES, PUBLIC_ROUTES } from "@/app/routes";

describe("route metadata", () => {
  it("keeps the home route public and available", () => {
    expect(PUBLIC_ROUTES.home).toMatchObject({
      path: "/",
      title: "Couple Finance",
      status: "available"
    });
  });

  it("defines all auth route contracts", () => {
    expect(PUBLIC_ROUTES.login.path).toBe("/login");
    expect(PUBLIC_ROUTES.signUp.path).toBe("/sign-up");
    expect(PUBLIC_ROUTES.forgotPassword.path).toBe("/forgot-password");
    expect(PUBLIC_ROUTES.resetPassword.path).toBe("/reset-password");
    expect(PRIVATE_ROUTES.app.path).toBe("/app");
  });

  it("marks future protected areas as planned only", () => {
    expect(FUTURE_PROTECTED_AREAS).not.toHaveLength(0);
    expect(FUTURE_PROTECTED_AREAS.every((area) => area.status === "planned")).toBe(true);
  });
});
