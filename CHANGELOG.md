# Changelog

## 0.1.3 (2026-10)

### Security

- The **Base URL** of the Smstools API credential is now validated. Only `https://api.smstools.com` (default)
  and `https://api.smsgatewayapi.com` are accepted. `http://`, other hosts, ports, user info and paths are
  refused with a clear error before any request is sent, so the client secret can no longer leak to another server.
- The credential checks the target of every request (node, credential test and other nodes that use this
  credential) before it adds the `X-Client-Id` / `X-Client-Secret` headers.
- Existing credentials keep working when their Base URL is one of the two hosts above (with or without a trailing
  slash). An empty Base URL falls back to `https://api.smstools.com`.
