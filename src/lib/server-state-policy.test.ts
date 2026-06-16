/// <reference types="node" />

import { readFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";

import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const sourceRoot = join(projectRoot, "src");
const policyPath = join(projectRoot, "src/lib/server-state-policy.md");

const reactQueryTerms = [
  "@tanstack/react-query",
  "QueryClient",
  "QueryClientProvider",
  "useQuery",
  "useMutation",
  "invalidateQueries"
] as const;

const focusRefetchTerms = ["refetchOnWindowFocus", "focusManager"] as const;

const sourceScanExclusions = new Set([
  "lib/server-state-policy.test.ts",
  "test/server-state-focus-test-utils.ts"
]);

describe("server state policy", () => {
  it("keeps TanStack Query out of package dependencies for F15", async () => {
    const packageJson = await readJson<Record<string, Record<string, string>>>("package.json");
    const packageLock = await readJson<Record<string, unknown>>("package-lock.json");
    const declaredDependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };

    for (const term of reactQueryTerms) {
      expect(declaredDependencies[term]).toBeUndefined();
    }
    expect(JSON.stringify(packageLock)).not.toContain("@tanstack/react-query");
  });

  it("requires the F15 policy to document any React Query focus behavior term", async () => {
    const sourceFiles = await listSourceFiles(sourceRoot);
    const policy = await readFile(policyPath, "utf8");
    const scannedText = (
      await Promise.all(
        sourceFiles
          .filter((file) => !sourceScanExclusions.has(file))
          .map(async (file) => readFile(join(sourceRoot, file), "utf8"))
      )
    ).join("\n");

    expect(scannedText).not.toContain("@tanstack/react-query");
    for (const term of focusRefetchTerms) {
      expect(policy).toContain(term);
      expect(scannedText).not.toContain(term);
    }
  });

  it("keeps global focus or visibility reload listeners out of remote source files", async () => {
    const sourceFiles = await listSourceFiles(sourceRoot);
    const listenerPattern =
      /(?:window|document)\.addEventListener\(\s*["'](?:focus|visibilitychange|pageshow)["']/;
    const offenders: string[] = [];

    for (const file of sourceFiles) {
      if (
        sourceScanExclusions.has(file) ||
        file.endsWith(".test.tsx") ||
        file.endsWith(".test.ts")
      ) {
        continue;
      }
      const contents = await readFile(join(sourceRoot, file), "utf8");
      if (listenerPattern.test(contents)) {
        offenders.push(file);
      }
    }

    expect(offenders).toEqual([]);
  });
});

async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(join(projectRoot, path), "utf8")) as T;
}

async function listSourceFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        return listSourceFiles(entryPath);
      }
      if (!/\.(ts|tsx)$/.test(entry.name)) {
        return [];
      }
      return [relative(sourceRoot, entryPath)];
    })
  );

  return files.flat();
}
