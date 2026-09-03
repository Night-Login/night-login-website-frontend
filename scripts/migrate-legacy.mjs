/** One-time, non-overwriting import of the 2024 source tree. See docs/MIGRATION.md. */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

const source = process.argv[2];
if (!source || !existsSync(path.join(source, "src/pages/_app.tsx"))) {
  throw new Error(
    "Pass a checkout of night-login-website-2024 as the first argument.",
  );
}
const root = process.cwd();
for (const target of ["app", "src", "public", "docs/legacy"]) {
  if (existsSync(path.join(root, target)))
    throw new Error(`Refusing to overwrite ${target}`);
}

const files = {
  "src/components/Button.tsx": "src/components/Elements/Button.tsx",
  "src/components/Chatbot.tsx": "src/components/Elements/Chatbot.tsx",
  "src/components/Footer.tsx": "src/components/Elements/Footer.tsx",
  "src/components/Navbar.tsx": "src/components/Layouts/Navbar/Navbar.tsx",
  "src/components/layout/Layout.tsx":
    "src/components/Layouts/DefaultLayout.tsx",
  "src/components/Dashboard/Layout.tsx":
    "src/components/Layouts/DashboardLayout.tsx",
  "src/components/Dashboard/FormInput.tsx":
    "src/modules/dashboard/components/FormInput.tsx",
  "src/components/Dashboard/RoleBasedDashboard.tsx":
    "src/modules/dashboard/components/RoleBasedDashboard.tsx",
  "src/components/Payment/PaymentPage.tsx":
    "src/modules/payment/PaymentPage.tsx",
  "src/data/dummy/TalentData.tsx": "src/modules/talent-pool/data/TalentData.ts",
  "src/lib/api.ts": "src/utils/http/api.ts",
  "src/lib/auth.ts": "src/utils/auth/session.ts",
  "src/types/next-auth.d.ts": "src/utils/types/next-auth.d.ts",
  "src/pages/index.tsx": "src/modules/home/HomePage.tsx",
  "src/pages/about.tsx": "src/modules/about/AboutPage.tsx",
  "src/pages/coming-soon.tsx": "src/modules/coming-soon/ComingSoonPage.tsx",
  "src/pages/wallpapers.tsx": "src/modules/wallpapers/WallpapersPage.tsx",
  "src/pages/talent-pool/index.tsx":
    "src/modules/talent-pool/TalentPoolPage.tsx",
  "src/pages/onboarding.tsx": "src/modules/onboarding/OnboardingPage.tsx",
  "src/pages/requests/login.tsx": "src/modules/auth/LoginPage.tsx",
  "src/pages/requests/register.tsx": "src/modules/auth/RegisterPage.tsx",
  "src/pages/dashboard/index.tsx": "src/modules/dashboard/DashboardPage.tsx",
  "src/pages/dashboard/request.tsx": "src/modules/dashboard/RequestPage.tsx",
  "src/pages/dashboard/history.tsx": "src/modules/dashboard/HistoryPage.tsx",
  "src/pages/dashboard/guide.tsx": "src/modules/dashboard/GuidePage.tsx",
  "src/pages/dashboard/faq.tsx": "src/modules/dashboard/FaqPage.tsx",
  "src/pages/api/auth/[...nextauth].ts": "src/utils/auth/options.ts",
};
for (const name of [
  "Hero",
  "Intro",
  "ProjectCard",
  "Projects",
  "Solutions",
  "Testimony",
]) {
  files[`src/components/Landing/${name}.tsx`] =
    `src/modules/home/components/${name}.tsx`;
}
for (const name of ["Card", "Chips", "Modal"]) {
  files[`src/components/Talent-Pool/${name}.tsx`] =
    `src/modules/talent-pool/components/${name}.tsx`;
}
const moduleAlias = (file) =>
  "@/" + file.replace(/^src\//, "").replace(/\.(tsx?|jsx?)$/, "");
function rewriteImport(specifier, oldPath) {
  if (specifier.includes("public/"))
    return "@public/" + specifier.split("public/")[1];
  if (specifier === "next/router") return "next/navigation";
  const resolved = specifier.startsWith("@/")
    ? "src/" + specifier.slice(2)
    : specifier.startsWith(".")
      ? path.posix.normalize(
          path.posix.join(path.posix.dirname(oldPath), specifier),
        )
      : null;
  if (!resolved) return specifier;
  const key = [resolved, resolved + ".tsx", resolved + ".ts"].find(
    (candidate) => files[candidate],
  );
  if (!key) throw new Error(`Unmapped import ${specifier} in ${oldPath}`);
  return moduleAlias(files[key]);
}
for (const [oldPath, newPath] of Object.entries(files)) {
  let text = readFileSync(path.join(source, oldPath), "utf8").replace(
    /\r\n/g,
    "\n",
  );
  text = text
    .replace(/^import Head from ["']next\/head["'];?\n/gm, "")
    .replace(/\s*<Head>[\s\S]*?<\/Head>/g, "");
  text = text.replace(
    /(\bfrom\s+["'])([^"']+)(["'])/g,
    (_, before, spec, after) => before + rewriteImport(spec, oldPath) + after,
  );
  if (oldPath.startsWith("src/pages/dashboard/")) {
    text = text
      .replace(/^import DashboardLayout[^\n]*\n/m, "")
      .replace(/<DashboardLayout>/g, "<>")
      .replace(/<\/DashboardLayout>/g, "</>");
  }
  if (newPath.endsWith("auth/options.ts")) {
    text = text
      .replace(
        "import NextAuth, { NextAuthOptions }",
        "import type { NextAuthOptions }",
      )
      .replace(/\nexport default NextAuth\(authOptions\);\s*$/, "\n");
  }
  // Only interactive leaves need a client boundary. Route files remain server components.
  if (
    /\b(useState|useEffect|useSession|useRouter|createPortal)\b/.test(text) &&
    newPath.endsWith(".tsx")
  ) {
    text = '"use client";\n\n' + text;
  }
  mkdirSync(path.dirname(path.join(root, newPath)), { recursive: true });
  writeFileSync(path.join(root, newPath), text);
}
mkdirSync(path.join(root, "src/styles"), { recursive: true });
cpSync(
  path.join(source, "src/styles/globals.css"),
  path.join(root, "src/styles/globals.css"),
);
cpSync(path.join(source, "public"), path.join(root, "public"), {
  recursive: true,
  errorOnExist: true,
  force: false,
});
cpSync(path.join(source, "docs"), path.join(root, "docs/legacy"), {
  recursive: true,
  errorOnExist: true,
  force: false,
});
cpSync(
  path.join(source, "README.md"),
  path.join(root, "docs/legacy/README.md"),
);
cpSync(
  path.join(source, "tailwind.config.ts"),
  path.join(root, "tailwind.config.ts"),
);
console.log(
  `Imported ${Object.keys(files).length} source files and the original assets. No old Git history was imported.`,
);
