import { describe, expect, it } from "vitest";

import { CATEGORY_MESSAGES } from "./category-messages";

describe("category messages", () => {
  it("keeps category states concise and free from financial data claims", () => {
    expect(CATEGORY_MESSAGES.loadingMessage).toBe("Carregando opcoes padrao.");
    expect(CATEGORY_MESSAGES.emptyMessage).toBe("Nenhuma categoria padrao esta disponivel.");
    expect(Object.values(CATEGORY_MESSAGES).join(" ")).not.toMatch(
      /saldo|total|transacao|compartilhado|individual|supabase|rls|sql/i
    );
  });
});
