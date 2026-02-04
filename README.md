# n8n-nodes-smstools

Community node for **Smstools** — the Belgian SMS gateway platform [smstools.be](https://www.smstools.be) and [smstools.com](https://www.smstools.com).  
This node lets you send SMS messages, send voice messages, check delivery statuses, view your account balance, get available sender IDs, and format numbers directly in your n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

---

## 🧩 Installation

Follow the [official guide for installing community nodes](https://docs.n8n.io/integrations/community-nodes/installation/).

Once installed, search for **Smstools** in the Nodes panel within n8n.

---

## ⚙️ Supported Operations

| Resource    | Operation           | Endpoint                 |
|--------------|--------------------|--------------------------|
| **Message**  | Send message        | `POST /v1/message/send`  |
| **Message**  | Send voice message  | `POST /v1/voice/send`    |
| **Account**  | Auth info           | `GET /v1/auth`           |
| **Account**  | Get balance         | `GET /v1/account/balance`|
| **Account**  | Get sender IDs      | `GET /v1/senderids`      |
| **Tools**    | Format number       | `POST /v1/format/number` |

---

## 🔐 Credentials

To connect with Smstools, you’ll need a **Client ID** and **Client Secret**.  
These are available in your Smstools account dashboard.

| Field | Description |
|--------|-------------|
| **Base URL** | Default: `https://api.smstools.com` (change only for private gateways) |
| **Client ID** | Your API client ID from Smstools |
| **Client Secret** | Your API client secret from Smstools |

When you test credentials, the node calls `GET /v1/auth` and expects a valid username response on success.

---

## 🧪 Example Usage

### Send an SMS

1. Add the **Smstools** node.  
2. Choose **Resource:** `Message`, **Operation:** `Send message`.  
3. Enter:
   - **Sender:** `MyCompany`
   - **To:** `+3247XXXXXXX`
   - **Message:** `Your package has been shipped!`
4. *(Optional)* Enable **Test Mode** to simulate sending.

The node will return the API response containing the message ID and status.

---

### Send a Voice Message

1. Add the **Smstools** node.  
2. Choose **Resource:** `Message`, **Operation:** `Send voice message`.  
3. Enter:
   - **To:** `+3247XXXXXXX`
   - **Message:** `This is a test voice message from Smstools.`

The API will convert your text to speech and call the recipient.

---

## 🧾 Compatibility

- **Minimum n8n version:** `1.0.0+`
- **Tested with:** `n8n 1.68+`
- **Dependencies:** none external — uses built-in `httpRequest` helper.
- **Supported Node.js (for n8n):** `>= 20.19 <= 24.x`

---

## 📘 Resources

- [Smstools API documentation](https://www.smstools.com/en/sms-gateway-api)
- [Smstools Dashboard](https://app.smstools.com/)
- [n8n Community Nodes documentation](https://docs.n8n.io/integrations/#community-nodes)

---

## 🧱 Version History

| Version | Date     | Notes |
|----------|----------|-------|
| **0.1.0** | 2025-10 | Initial community release with v1 API support for message, voice, account, and tools resources. |
| **0.1.1** | 2025-10 | Update readme.md |
| **0.1.2** | 2026-02 | Fix n8n review issues (peer deps, auth, pairedItem, continueOnFail, icons) |

---

**Author:** Smstools ([info@smstools.be](mailto:info@smstools.be))  
**License:** MIT  
**Repository:** [GitHub](https://github.com/Smstools-api/n8n-nodes-smstools)  
**npm:** [n8n-nodes-smstools](https://www.npmjs.com/package/n8n-nodes-smstools)