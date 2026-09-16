import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { once } from "node:events";
import { setTimeout as delay } from "node:timers/promises";
import { after, before, test } from "node:test";

let backend;
let app;
let baseUrl;
let backendUrl;
let onboardingCompleted = false;
let output = "";
const cookies = new Map();

async function listen(server) {
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  return server.address().port;
}

async function request(route, options = {}) {
  const response = await fetch(baseUrl + route, {
    ...options,
    redirect: "manual",
    headers: {
      Cookie: [...cookies].map(([k, v]) => `${k}=${v}`).join("; "),
      ...options.headers,
    },
  });
  for (const raw of response.headers.getSetCookie()) {
    const pair = raw.split(";", 1)[0];
    const split = pair.indexOf("=");
    cookies.set(pair.slice(0, split), pair.slice(split + 1));
  }
  return response;
}

before(async () => {
  backend = createServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const data = chunks.length
      ? JSON.parse(Buffer.concat(chunks).toString())
      : {};
    res.setHeader("Content-Type", "application/json");
    if (req.url === "/api/v1/user/login" && req.method === "POST") {
      if (
        data.email !== "migration@example.test" ||
        data.password !== "test-password"
      ) {
        res.writeHead(401).end(JSON.stringify({ status: 401 }));
        return;
      }
      res.end(
        JSON.stringify({
          status: 200,
          data: {
            accessToken: "local-test-token",
            user: {
              id: "test-member",
              email: data.email,
              name: "Migration Test",
              role: "member",
              onboardingCompleted,
            },
          },
        }),
      );
      return;
    }
    if (req.headers.authorization !== "Bearer local-test-token") {
      res.writeHead(401).end(JSON.stringify({ message: "Unauthorized" }));
      return;
    }
    if (req.url === "/api/v1/onboarding/status") {
      res.end(
        JSON.stringify({ data: { onboardingCompleted, role: "member" } }),
      );
    } else if (
      req.url === "/api/v1/onboarding/complete" &&
      req.method === "POST"
    ) {
      onboardingCompleted = true;
      res.end(JSON.stringify({ status: 200 }));
    } else {
      res.writeHead(404).end("{}");
    }
  });
  backendUrl = `http://127.0.0.1:${await listen(backend)}`;
  const reservation = createServer();
  const port = await listen(reservation);
  await new Promise((resolve) => reservation.close(resolve));
  baseUrl = `http://127.0.0.1:${port}`;
  app = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      String(port),
    ],
    {
      cwd: new URL("..", import.meta.url),
      env: {
        ...process.env,
        BACKEND_URL: backendUrl,
        NEXTAUTH_URL: baseUrl,
        NEXTAUTH_SECRET: randomBytes(32).toString("hex"),
        NEXT_TELEMETRY_DISABLED: "1",
      },
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  app.stdout.on("data", (chunk) => {
    output += chunk;
  });
  app.stderr.on("data", (chunk) => {
    output += chunk;
  });
  for (let attempt = 0; attempt < 120; attempt++) {
    if (app.exitCode !== null)
      throw new Error(`Next.js exited early: ${output}`);
    try {
      const response = await request("/api/auth/session");
      if (response.status === 200) return;
    } catch {
      /* Startup in progress. */
    }
    await delay(250);
  }
  throw new Error(`Next.js did not become ready: ${output}`);
});

after(async () => {
  if (app && app.exitCode === null) {
    app.kill();
    await once(app, "exit");
  }
  if (backend) await new Promise((resolve) => backend.close(resolve));
});

test("public routes render and Projects preserves its legacy redirect", async () => {
  for (const route of [
    "/",
    "/about",
    "/coming-soon",
    "/talent-pool",
    "/wallpapers",
    "/requests/login",
    "/requests/register",
    "/requests/payment",
    "/onboarding",
  ]) {
    const response = await request(route);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert.ok(html.includes("<html"), route);
    assert.ok(!html.includes('id="__next_error__"'), route);
  }
  const redirect = await request("/projects");
  assert.equal(redirect.status, 307);
  assert.equal(redirect.headers.get("location"), "/coming-soon");
});

test("dashboard URLs require authentication and preserve the callback path", async () => {
  for (const route of [
    "/dashboard",
    "/dashboard/request",
    "/dashboard/history",
    "/dashboard/guide",
    "/dashboard/faq",
    "/admin",
    "/leader",
  ]) {
    const response = await request(route);
    assert.equal(response.status, 307, route);
    const target = new URL(response.headers.get("location"), baseUrl);
    assert.equal(target.pathname, "/requests/login");
    assert.equal(target.searchParams.get("callbackUrl"), route);
  }
});

test("credentials login rejects a bad password and issues a valid session for a member", async () => {
  const { csrfToken } = await (await request("/api/auth/csrf")).json();
  const login = (password) =>
    request("/api/auth/callback/credentials", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        csrfToken,
        email: "migration@example.test",
        password,
        json: "true",
        callbackUrl: baseUrl + "/dashboard",
      }),
    });
  const rejected = await login("wrong-password");
  assert.equal(rejected.status, 401);
  assert.deepEqual(await (await request("/api/auth/session")).json(), {});
  const accepted = await login("test-password");
  assert.equal(accepted.status, 200);
  const session = await (await request("/api/auth/session")).json();
  assert.equal(session.user.id, "test-member");
  assert.equal(session.user.role, "member");
  assert.equal(session.user.onboardingCompleted, false);
  assert.ok(cookies.has("next-auth.session-token"));
  const guarded = await request("/dashboard");
  assert.equal(
    new URL(guarded.headers.get("location"), baseUrl).pathname,
    "/onboarding",
  );
});

test("session updates ignore client-supplied roles and confirm onboarding with the backend", async () => {
  const { csrfToken } = await (await request("/api/auth/csrf")).json();
  const update = async () =>
    (
      await request("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          csrfToken,
          data: { user: { role: "admin", onboardingCompleted: true } },
        }),
      })
    ).json();
  const unchanged = await update();
  assert.equal(unchanged.user.role, "member");
  assert.equal(unchanged.user.onboardingCompleted, false);
  await fetch(backendUrl + "/api/v1/onboarding/complete", {
    method: "POST",
    headers: {
      Authorization: "Bearer local-test-token",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role: "member", profileData: {} }),
  });
  const refreshed = await update();
  assert.equal(refreshed.user.role, "member");
  assert.equal(refreshed.user.onboardingCompleted, true);
  for (const route of [
    "/dashboard",
    "/dashboard/request",
    "/dashboard/history",
    "/dashboard/guide",
    "/dashboard/faq",
    "/admin",
    "/leader",
  ]) {
    assert.equal((await request(route)).status, 200, route);
  }
});

test("sign out clears the session and protects dashboard again", async () => {
  const { csrfToken } = await (await request("/api/auth/csrf")).json();
  await request("/api/auth/signout", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      csrfToken,
      callbackUrl: baseUrl + "/",
      json: "true",
    }),
  });
  assert.deepEqual(await (await request("/api/auth/session")).json(), {});
  assert.equal((await request("/dashboard")).status, 307);
});
