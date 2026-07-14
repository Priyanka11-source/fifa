---
name: No-LLM-key fallback
description: What to do when a "GenAI" feature is requested but no working LLM API key is available and the user declines to add one.
---

When a user declines a Replit-managed AI integration upgrade and their manually supplied API key turns out to be invalid, do not keep retrying the key or silently ship hardcoded/static mock data. Instead, ask the user explicitly (e.g. via AskQuestion) whether to keep retrying or ship a functional fallback.

If they choose the fallback, build a deterministic/rule-based engine that still computes from real, live application state (simulated telemetry, DB rows, etc.) rather than fixed fixtures. E.g. for a multilingual concierge: language/intent detection via keyword and Unicode-range heuristics, replies generated from templates interpolated with live values. For an "operational intelligence brief": inspect live metrics and emit prioritized directives via authored thresholds/logic instead of an LLM call.

**Why:** This preserves genuine functional value (the feature still reacts to real, changing data and feels alive) and stays honest — it doesn't claim LLM-backed intelligence it doesn't have — while unblocking delivery without a working API key.

**How to apply:** Keep any "brief"/"assistant"/"insights" endpoint's output shape (schema) identical whether backed by an LLM or the deterministic engine, so swapping in real AI later is a drop-in change to just the route handler's internals.
