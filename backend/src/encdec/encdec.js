const crypto = require("crypto");

const fs = require("fs");
const secretKey = process.env.SECRET_KEY;
const secretIv = process.env.SECRET_IV;
const { pipeline } = require("stream");

const key = crypto
  .createHash("sha512")
  .update(secretKey, "utf-8")
  .digest("hex")
  .substring(0, 32);
const iv = crypto
  .createHash("sha512")
  .update(secretIv, "utf-8")
  .digest("hex")
  .substring(0, 16);

const encriptionMethod = "AES-256-CBC";

const decryptFile = async (filePath) => {
  try {
    // Read the encrypted file
    const encryptedContent = fs.readFileSync(filePath, "utf-8");

    // Create decipher instance
    const decipher = crypto.createDecipheriv(encriptionMethod, key, iv);

    // Decrypt the content
    let decryptedContent = decipher.update(encryptedContent, "base64", "utf-8");
    decryptedContent += decipher.final("utf-8");

    // Write the decrypted content back to the same file
    fs.writeFileSync(filePath, decryptedContent);

    console.log("File decrypted and saved successfully:", filePath);
    return filePath;
  } catch (error) {
    console.error("Error decrypting and saving file:", error);
    throw error;
  }
};

const encryptFile = async (content) => {
  const cipher = crypto.createCipheriv(encriptionMethod, key, iv);
  let encryptedContent = cipher.update(content, "utf8", "base64");
  encryptedContent += cipher.final("base64");
  return encryptedContent;
};

module.exports = {
  encryptFile,
  decryptFile,
};
