import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => readFileSync(path.join(root, file), "utf8");
const routes = [
  "app/(public)/page.tsx",
  "app/(public)/about/page.tsx",
  "app/(public)/projects/page.tsx",
  "app/(public)/coming-soon/page.tsx",
  "app/(public)/talent-pool/page.tsx",
  "app/(public)/wallpapers/page.tsx",
  "app/requests/login/page.tsx",
  "app/requests/register/page.tsx",
  "app/requests/payment/page.tsx",
  "app/onboarding/page.tsx",
  "app/dashboard/page.tsx",
  "app/dashboard/request/page.tsx",
  "app/dashboard/history/page.tsx",
  "app/dashboard/guide/page.tsx",
  "app/dashboard/faq/page.tsx",
];

test("all 15 legacy page URLs have App Router entry points", () => {
  for (const route of routes)
    assert.ok(existsSync(path.join(root, route)), route);
  assert.ok(!existsSync(path.join(root, "src/pages")));
  assert.match(
    read("app/(public)/projects/page.tsx"),
    /redirect\("\/coming-soon"\)/,
  );
});

test("every legacy asset is copied byte-for-byte", () => {
  const { assets } = JSON.parse(read("tests/fixtures/legacy-assets.json"));
  assert.ok(Object.keys(assets).length > 50);
  for (const [file, expected] of Object.entries(assets)) {
    const actual = createHash("sha256")
      .update(readFileSync(path.join(root, "public", file)))
      .digest("hex");
    assert.equal(actual, expected, file);
  }
});

test("no Pages Router imports or obsolete asset traversals remain", () => {
  for (const directory of ["app", "src"]) {
    for (const file of readdirSync(path.join(root, directory), {
      recursive: true,
    })) {
      if (!/\.(ts|tsx)$/.test(file)) continue;
      const content = read(path.join(directory, file));
      assert.doesNotMatch(
        content,
        /["']next\/(router|head|app|document)["']/,
        file,
      );
      assert.doesNotMatch(content, /["']@\/\.\.\//, file);
    }
  }
});

test("auth exposes the same endpoint using GET and POST route handlers", () => {
  assert.match(
    read("app/api/auth/[...nextauth]/route.ts"),
    /handler as GET, handler as POST/,
  );
  const options = read("src/utils/auth/options.ts");
  for (const endpoint of [
    "/api/v1/user/login",
    "/api/v1/user/oauth-login",
    "/api/v1/onboarding/status",
  ]) {
    assert.ok(options.includes(endpoint), endpoint);
  }
});

test("dashboard chrome lives in a shared layout, not individual feature pages", () => {
  assert.match(read("app/dashboard/layout.tsx"), /DashboardLayout/);
  for (const route of [
    "DashboardPage",
    "RequestPage",
    "HistoryPage",
    "GuidePage",
    "FaqPage",
  ]) {
    assert.doesNotMatch(
      read(`src/modules/dashboard/${route}.tsx`),
      /DashboardLayout/,
    );
  }
});
