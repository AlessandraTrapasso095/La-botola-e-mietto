import fs from "node:fs";
import { execSync } from "node:child_process";

const failures = [];
const warnings = [];

function section(title) {
  console.log();
  console.log("================================================");
  console.log(title);
  console.log("================================================");
}

function ok(message) {
  console.log(`✅ ${message}`);
}

function fail(message) {
  console.log(`❌ ${message}`);
  failures.push(message);
}

function warn(message) {
  console.log(`⚠️  ${message}`);
  warnings.push(message);
}

function run(command, label) {
  try {
    execSync(command, {
      stdio: "inherit",
      env: process.env,
    });

    ok(label);
  } catch {
    fail(label);
  }
}

section("LA BOTOLA E MIETTO — PROJECT DOCTOR");

section("1. RUNTIME");

const nodeMajor = Number(process.versions.node.split(".")[0]);

console.log(`Node: ${process.version}`);

if (nodeMajor === 22) {
  ok("Node 22");
} else {
  warn(`Node ${nodeMajor}: progetto validato con Node 22`);
}

section("2. GIT");

try {
  const branch = execSync("git branch --show-current", {
    encoding: "utf8",
  }).trim();

  console.log(`Branch: ${branch}`);

  if (branch === "phase-2-checkout-local") {
    ok("Branch di sviluppo corretto");
  } else {
    warn(`Branch attuale: ${branch}`);
  }

  const status = execSync("git status --porcelain", {
    encoding: "utf8",
  }).trim();

  if (!status) {
    ok("Working tree pulita");
  } else {
    warn("Working tree contiene modifiche");
    console.log(status);
  }
} catch {
  fail("Controllo Git");
}

section("3. ENVIRONMENT");

const requiredEnv = [
  "NEXT_PUBLIC_SITE_URL",
  "CATALOG_REPOSITORY",
  "AUTH_SERVICE",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
];

const rawEnv = fs.existsSync(".env.local")
  ? fs.readFileSync(".env.local", "utf8")
  : "";

const envNames = new Set();

for (const rawLine of rawEnv.split(/\r?\n/)) {
  const line = rawLine.trim();

  if (
    !line ||
    line.startsWith("#") ||
    !line.includes("=")
  ) {
    continue;
  }

  const separator = line.indexOf("=");

  const name = line
    .slice(0, separator)
    .trim();

  const value = line
    .slice(separator + 1)
    .trim()
    .replace(/^['"]|['"]$/g, "");

  if (value) {
    envNames.add(name);
  }
}

for (const name of requiredEnv) {
  if (envNames.has(name)) {
    ok(`${name} presente`);
  } else {
    fail(`${name} mancante`);
  }
}

section("4. SECURITY BASICS");

try {
  const ignoredEnv = execSync(
    "git check-ignore .env.local",
    { encoding: "utf8" }
  ).trim();

  if (ignoredEnv) {
    ok(".env.local ignorato da Git");
  } else {
    fail(".env.local NON ignorato da Git");
  }
} catch {
  fail(".env.local NON ignorato da Git");
}

try {
  const ignoredReference = execSync(
    "git check-ignore reference-private",
    { encoding: "utf8" }
  ).trim();

  if (ignoredReference) {
    ok("reference-private ignorato da Git");
  } else {
    warn("reference-private non trovato o non ignorato");
  }
} catch {
  warn("reference-private non trovato o non ignorato");
}

section("5. TYPECHECK");
run("npm run typecheck", "TypeScript");

section("6. LINT");
run("npm run lint -- --max-warnings=0", "ESLint — zero warnings");

section("7. BUILD");
run("npm run build", "Production build");

section("8. RISULTATO");

if (warnings.length) {
  console.log();
  console.log(`Warning: ${warnings.length}`);

  for (const message of warnings) {
    console.log(`- ${message}`);
  }
}

if (failures.length) {
  console.log();
  console.log(`❌ DOCTOR FALLITO — ${failures.length} problema/i`);

  for (const message of failures) {
    console.log(`- ${message}`);
  }

  process.exitCode = 1;
} else {
  console.log();
  console.log("✅ PROJECT DOCTOR SUPERATO");

  if (warnings.length === 0) {
    console.log("✅ Nessun warning del doctor");
  }
}
