// Server access: a typed email alone must never unlock an elevated role.
// Run: node --test tests/access.test.mjs
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  getPolicy,
  sessionRoleFor,
  signSession,
  verifySession,
} from "../netlify/functions/_allowlist.mjs";

const OWNER = "owner@studio.test";
const ENV_KEYS = [
  "PULSEGRID_ADMIN_EMAILS",
  "PULSEGRID_SESSION_SECRET",
  "PULSEGRID_ADMIN_CODE",
  "PULSEGRID_SPONSOR_CODE",
  "PULSEGRID_DONOR_CODE",
];

beforeEach(() => {
  for (const k of ENV_KEYS) delete process.env[k];
  process.env.PULSEGRID_ADMIN_EMAILS = OWNER;
});

function configure({ secret = "s3cret", code = "admin-code" } = {}) {
  if (secret) process.env.PULSEGRID_SESSION_SECRET = secret;
  if (code) process.env.PULSEGRID_ADMIN_CODE = code;
  return getPolicy();
}

test("admin email without a code gets trial", () => {
  assert.equal(sessionRoleFor(OWNER, "", configure()), "trial");
});

test("admin email with the wrong code gets trial", () => {
  assert.equal(sessionRoleFor(OWNER, "guess", configure()), "trial");
});

test("admin email with the right code gets admin", () => {
  assert.equal(sessionRoleFor(OWNER, "admin-code", configure()), "admin");
});

test("no access code configured means nobody gets admin", () => {
  assert.equal(sessionRoleFor(OWNER, "", configure({ code: "" })), "trial");
});

test("no session secret means nobody gets admin", () => {
  assert.equal(sessionRoleFor(OWNER, "admin-code", configure({ secret: "" })), "trial");
});

test("the admin code does not make an unlisted email admin", () => {
  assert.equal(sessionRoleFor("someone@else.test", "admin-code", configure()), "trial");
});

test("a forged unsigned admin token is rejected", async () => {
  const forged = "pg." + btoa(JSON.stringify({ email: OWNER, role: "admin", u: true }));
  assert.equal(await verifySession(forged, ""), null);
});

test("an unsigned trial token still works without a secret", async () => {
  const token = await signSession({ email: "a@b.test", role: "trial" }, "");
  assert.equal((await verifySession(token, "")).role, "trial");
});

test("a signed token with an edited role is rejected", async () => {
  const token = await signSession({ email: "a@b.test", role: "trial" }, "s3cret");
  const [, data, sig] = token.split(".");
  const edited = JSON.parse(atob(data));
  edited.role = "admin";
  const tampered = `pg.${btoa(JSON.stringify(edited))}.${sig}`;
  assert.equal(await verifySession(tampered, "s3cret"), null);
});

test("POST /api/access/session gives a typed admin email trial", async () => {
  configure();
  const { default: session } = await import("../netlify/functions/session.mts");
  const post = (body) =>
    session(new Request("http://x/api/access/session", { method: "POST", body: JSON.stringify(body) }));
  const plain = await (await post({ email: OWNER, humanOk: true })).json();
  assert.equal(plain.role, "trial");
  const coded = await (await post({ email: OWNER, humanOk: true, code: "admin-code" })).json();
  assert.equal(coded.role, "admin");
});
