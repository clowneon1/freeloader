# Freeloader 🔐📦

**Unlimited Free Encrypted Storage Using Discord**

Freeloader is a Discord bot that provides **practically unlimited free storage** by using Discord as a storage backend — **without exposing your data**.

Files are **encrypted locally before upload**, split into **24 MB chunks**, uploaded to Discord, and indexed securely in **MongoDB**. Discord only ever sees **encrypted binary blobs**, never your actual file contents or metadata.

---

## 🔥 How It Works

1. **Select a file**
2. The bot:

   * Encrypts the file **before any upload**
   * Splits the encrypted data into **24 MB chunks**
3. Each chunk is uploaded to Discord
4. Discord returns **attachment URLs**
5. The bot:

   * Encrypts chunk metadata
   * Stores URLs, ordering, and file info in **MongoDB**
6. To download:

   * Metadata is decrypted
   * Chunks are downloaded
   * File is reconstructed
   * File is decrypted locally

📌 **End-to-end encryption** from your machine → Discord → back_attach → your machine.

---

## ✨ Key Features

✅ Client-side encryption before upload
✅ Discord never sees plaintext data
✅ Unlimited storage (Discord-backed)
✅ 24 MB chunking to stay under limits
✅ Encrypted metadata storage
✅ MongoDB file index
✅ Docker-ready deployment

---

## 🔐 Security Model

* **Encryption:** Symmetric (AES)
* **Encryption happens before upload**
* **Chunk metadata is encrypted**
* **Keys never leave the application**
* Discord only stores opaque encrypted blobs

> Without the encryption key, uploaded data is useless.

---

## 🧠 Why Discord?

* Free & reliable CDN
* Generous file limits
* Persistent URLs
* Global availability

Freeloader exploits these properties to act as a **free object storage layer**.

---

## 🏗 Architecture

```
Original File
   ↓
Client-side Encryption
   ↓
24MB Chunking
   ↓
Discord Upload (Encrypted Blobs)
   ↓
Attachment URLs
   ↓
Encrypted Metadata → MongoDB
```

---

## 🛠 Tech Stack

* **Node.js**
* **Discord.js**
* **MongoDB**
* **Docker**
* **AES Encryption**

---

## 📦 Installation

```bash
git clone https://github.com/clowneon1/freeloader.git
cd freeloader
npm install
```

---

## ⚙️ Environment Variables

Create `.env`:

```env
DISCORD_TOKEN=your_bot_token
MONGO_URI=mongodb_connection_string
ENCRYPTION_KEY=strong_secret_key
```

⚠️ **If you lose the encryption key, your data is unrecoverable.**

---

## ▶️ Run

### Local

```bash
npm start
```

### Docker

```bash
docker compose up -d
```

---

## 📜 Example Commands

| Command          | Description             |
| ---------------- | ----------------------- |
| `!upload <file>` | Encrypt & store file    |
| `!download <id>` | Retrieve & decrypt file |
| `!list`          | List stored files       |
| `!delete <id>`   | Delete file index       |

---

## ⚠️ Disclaimer

This project is for **educational and experimental use**.
Ensure compliance with **Discord’s Terms of Service**.

---

## 📜 License

MIT License

---

## 🧠 One-Liner

> Freeloader gives you unlimited encrypted storage by turning Discord into a secure, chunk-based object store.

---
