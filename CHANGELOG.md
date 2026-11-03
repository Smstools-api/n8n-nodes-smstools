# Changelog

## 0.1.4 (2026-11)

### Changed

- Published from GitHub Actions with an npm provenance statement (required by n8n for verified community nodes).
- Lint fixes for @n8n/node-cli 0.55: credential and themed node icons, node subtitle, operation actions, title-cased
  labels ("Send Message", "Get Sender IDs", resource "Tool"), category "Communication", errors wrapped in
  NodeApiError / NodeOperationError. Parameter values are unchanged, so existing workflows keep working.

## 0.1.3 (2026-10)

### Security

- The **Base URL** of the Smstools API credential is now validated. Only `https://api.smstools.com` (default)
  and `https://api.smsgatewayapi.com` are accepted. `http://`, other hosts, ports, user info and paths are
  refused with a clear error before any request is sent, so the client secret can no longer leak to another server.
- The credential checks the target of every request (node, credential test and other nodes that use this
  credential) before it adds the `X-Client-Id` / `X-Client-Secret` headers.
- Existing credentials keep working when their Base URL is one of the two hosts above (with or without a trailing
  slash). An empty Base URL falls back to `https://api.smstools.com`.
