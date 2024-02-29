const crypto = require("crypto");
const { decrypt } = require("dotenv");
const fs = require("fs");
const secretKey = process.env.SECRET_KEY;
const algorithm = "aes-256-ctr";
const key = crypto
  .createHash("sha256")
  .update(secretKey)
  .digest("base64")
  .substr(0, 32);

const decryptFile = async (filePath) => {
  try {
    // Read the encrypted file
    let encrypted = fs.readFileSync(filePath);
    const iv = encrypted.slice(0, 16);
    encrypted = encrypted.slice(16);

    // Create decipher instance
    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    // Decrypt the content
    let decryptedContent = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    // Write the decrypted content back to the same file
    fs.writeFileSync(filePath, decryptedContent);
    console.log("File decrypted and saved successfully:", filePath);
    return filePath;
  } catch (error) {
    console.error("Error decrypting and saving file:", error);
    throw error;
  }
};

const encryptFile = (buffer) => {
  // Create an initialization vector
  const iv = crypto.randomBytes(16);
  // Create a new cipher using the algorithm, key, and iv
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  // Create the new (encrypted) buffer
  const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
  return result;
};

module.exports = {
  encryptFile,
  decryptFile,
};
