# Example — Claude Code + Composio + PulseGrid

```text
System: SYSTEM_RULES.md + CLAUDE_COMPOSIO.md

User:
Bundle:
{ ... paste from Composio chip ... }

1) Fable 5.1: 2-sentence anti-slop summary for Notion title/body
2) Opus 5.5: validate banks; list tool_slugs to run
3) Execute Composio GitHub gist with pattern JSON only (no secrets)
4) Return gist URL
```
