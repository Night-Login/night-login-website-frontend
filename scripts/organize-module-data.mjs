/** Mechanical extraction of unchanged legacy sample data into feature-owned files. */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const talentFile = "src/modules/talent-pool/TalentPoolPage.tsx";
let talent = readFileSync(talentFile, "utf8");
const start = talent.indexOf("// Mock data");
const end = talent.indexOf("export default function TalentPool");
if (start === -1 || end <= start)
  throw new Error("Unexpected talent module shape");
const data = talent
  .slice(start, end)
  .replaceAll("const SKILLS", "export const SKILLS")
  .replaceAll("const MEMBERS", "export const MEMBERS");
writeFileSync(
  "src/modules/talent-pool/data/members.ts",
  'import type { Member, Skill } from "./TalentData";\n\n' + data,
);
talent = talent.slice(0, start) + talent.slice(end);
talent = talent.replace("import { Member, Skill }", "import type { Member }");
talent = talent.replace(
  "export default function TalentPool",
  'import { MEMBERS, SKILLS } from "@/modules/talent-pool/data/members";\n\nexport default function TalentPool',
);
writeFileSync(talentFile, talent);

const projectFile = "src/modules/home/components/Projects.tsx";
let project = readFileSync(projectFile, "utf8");
const images = project.match(
  /^import .+ from "@public\/assets\/images\/projects\/.+";$/gm,
);
const array = project.match(
  /  const \[projects, setProjects\] = useState\((\[[\s\S]*?\n  \])\);/,
);
if (!images || !array) throw new Error("Unexpected projects module shape");
mkdirSync("src/modules/home/data", { recursive: true });
writeFileSync(
  "src/modules/home/data/projects.ts",
  images.join("\n") + "\n\nexport const projects = " + array[1] + ";\n",
);
for (const line of images) project = project.replace(line + "\n", "");
project = project.replace(array[0], "");
project = project.replace(
  "function Projects()",
  'import { projects } from "@/modules/home/data/projects";\n\nfunction Projects()',
);
writeFileSync(projectFile, project);
