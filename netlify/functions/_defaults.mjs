/** Fallback allowlist when env + access-config.js file are unavailable on Lambda */
export const DEFAULT_ADMIN_EMAILS = [
  "owner@example.com",
  "admin1@example.com",
  "admin2@example.com",
  "admin3@example.com",
  "admin4@example.com",
  "admin5@example.com",
  "admin6@example.com",
  "admin7@example.com",
  "admin8@example.com",
  "admin9@example.com",
  "admin10@example.com",
  "admin11@example.com",
  "admin12@example.com",
];

export const DEFAULT_DONOR_EMAILS = [];
export const DEFAULT_SPONSOR_EMAILS = [];

export const DEFAULT_TRIAL = { edits: 25, exports: 5, donorGenDays: 7 };
