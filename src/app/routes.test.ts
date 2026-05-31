import { describe, expect, it } from "vitest";

import { FUTURE_PROTECTED_AREAS, PUBLIC_ROUTES } from "@/app/routes";

describe("route metadata", () => {
  it("keeps the home route public and available", () => {
    expect(PUBLIC_ROUTES.home).toMatchObject({
      path: "/",
      title: "Couple Finance",
      status: "available"
    });
  });

  it("marks future protected areas as planned only", () => {
    expect(FUTURE_PROTECTED_AREAS).not.toHaveLength(0);
    expect(FUTURE_PROTECTED_AREAS.every((area) => area.status === "planned")).toBe(true);
  });
});
