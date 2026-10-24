/**
 * PulseGrid SaaS — Access & licensing config (EDIT THIS FILE)
 * Owner can change admin emails, trial limits, license text, and tiers at any time.
 * For production, move secrets to server env; this client config is the control plane for demos.
 */
window.PulseGridAccess = {
  version: 8,
  product: "PulseGrid",

  /** Full admin access — owner + up to 12 trusted emails (edit freely) */
  adminEmails: [
    // PRIMARY OWNER — replace with your real address
    "owner@example.com",
    // Trusted admins (slots 2–12) — replace placeholders
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
    "admin12@example.com"
  ],

  /** Optional: additional sponsor/donor emails that get generation window without full admin */
  donorEmails: [
    // "sponsor@example.com"
  ],
  sponsorEmails: [
    // "bigsponsor@example.com"
  ],

  /** Everyone else: free trial — very limited */
  freeTrial: {
    enabled: true,
    maxSessions: 1,
    maxPatternEdits: 40,
    maxExports: 0,
    maxGenerations: 1,
    maxWavBounces: 0,
    maxMidiExports: 0,
    allowFxLabs: false,
    allowMidiOut: false,
    allowSampleKit: false,
    allowConnections: true,  // paste packages only
    allowMatrix: false,
    allowSongMode: false,
    watermark: true,
    label: "Free trial — very limited access"
  },

  /**
   * Generation window: ONLY for donators & sponsors (not plain free trial).
   * If subscribed/donated/sponsor → 7 days of generation quota from grant date.
   */
  generationGrant: {
    onlyFor: ["donor", "sponsor", "admin"],
    durationDays: 7,
    maxGenerationsPerGrant: 50,
    renewableByDonation: true,
    note: "7-day generation access is available only to donators and sponsors (and admins)."
  },

  /** OAuth providers — wire client IDs in production; buttons work in demo with mock */
  oauth: {
    google:   { enabled: true,  clientIdEnv: "GOOGLE_CLIENT_ID",   label: "Continue with Google" },
    github:   { enabled: true,  clientIdEnv: "GITHUB_CLIENT_ID",   label: "Continue with GitHub" },
    microsoft:{ enabled: true,  clientIdEnv: "MS_CLIENT_ID",       label: "Continue with Microsoft" },
    apple:    { enabled: true,  clientIdEnv: "APPLE_CLIENT_ID",    label: "Continue with Apple" },
    discord:  { enabled: true,  clientIdEnv: "DISCORD_CLIENT_ID",  label: "Continue with Discord" },
    twitter:  { enabled: false, clientIdEnv: "TWITTER_CLIENT_ID",  label: "Continue with X" },
    email:    { enabled: true,  magicLink: true,                   label: "Email magic link" }
  },

  /** Human verification */
  humanCheck: {
    required: true,
    modes: ["checkbox", "math"], // simple demo captcha; swap for Turnstile/hCaptcha/reCAPTCHA in prod
    failLimit: 5
  },

  /**
   * LICENSE CLAUSE — default statement covering “all licences”.
   * Admin may change this text inside the Admin console (stored in localStorage override).
   * For now: allow owner to rewrite freely in-product.
   */
  license: {
    editableByAdmin: true,
    defaultText:
`PulseGrid — Licensing notice (editable by owner)

ALL LICENCES: Software, patterns, generated packages, documentation, and brand assets
are provided under terms controlled by the project owner. Default distribution for the
open scaffold is MIT for source code, but the operator may change this clause at any
time from the Admin panel.

- Source / app: terms as stated by owner (default MIT until changed).
- User patterns & exports: belong to the creating account subject to platform ToS.
- AI paste packages (Suno/Udio/etc.): user is responsible for third-party service terms.
- Donations & sponsorships: grant limited generation windows only; do not transfer ownership.
- Admins (owner + configured emails): full access and the right to revise this licence text.

This clause can be updated inside Admin → Licence without redeploying code, for now.`
  },

  /** Session vault — pull old sessions from local keys */
  sessions: {
    pullKeys: [
      "pulsegrid_v7",
      "pulsegrid_v6",
      "pulsegrid_v5",
      "pulsegrid_v4",
      "pulsegrid_session",
      "pulsegrid_autosave",
      "PulseGrid",
      "pg_project"
    ],
    cloudStub: true // placeholder for Drive/Notion sync via Grok connected tools
  },

  donations: {
    enabled: true,
    labels: { donor: "Donor", sponsor: "Sponsor", admin: "Admin" },
    // Placeholder URLs — replace with Stripe/GitHub Sponsors/Ko-fi
    links: {
      donate: "https://github.com/sponsors",
      sponsor: "https://github.com/sponsors"
    }
  },

  musicGenerators: {
    local: true,      // procedural / package generators in-browser
    suno: true,
    udio: true,
    shoom: true,
    imagineMusic: true // Grok Imagine music tool bridge notes
  }
};
