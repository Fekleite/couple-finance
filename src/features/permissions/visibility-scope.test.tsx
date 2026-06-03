import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { VisibilityLabel } from "@/features/permissions/visibility-label";
import { classifyVisibility, getVisibilityLabel } from "@/features/permissions/visibility-scope";

describe("visibility scope", () => {
  it("classifies individual, shared, inaccessible and loading scopes", () => {
    expect(
      classifyVisibility({ state: "no_couple_link", dataScope: "individual", isOwner: true })
    ).toBe("individual");
    expect(
      classifyVisibility({
        state: "active_couple_link",
        dataScope: "shared",
        isActiveMember: true
      })
    ).toBe("shared");
    expect(classifyVisibility({ state: "unauthenticated", dataScope: "shared" })).toBe(
      "unknown_loading"
    );
    expect(classifyVisibility({ state: "unrelated_authenticated_user", dataScope: "shared" })).toBe(
      "inaccessible"
    );
  });

  it("provides accessible labels that do not depend on color alone", () => {
    render(<VisibilityLabel scope="shared" />);

    expect(screen.getByLabelText(/espaco compartilhado/i)).toBeInTheDocument();
    expect(screen.getByText(getVisibilityLabel("shared").label)).toBeInTheDocument();
  });

  it("keeps unavailable and checking labels neutral", () => {
    expect(getVisibilityLabel("inaccessible").description).toMatch(/nao esta disponivel/i);
    expect(getVisibilityLabel("unknown_loading").description).toMatch(/verificando seu acesso/i);
  });
});
