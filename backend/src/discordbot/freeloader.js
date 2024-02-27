const fs = require("fs");
const { Client, IntentsBitField } = require("discord.js");
const crypto = require("crypto");

const token = process.env.TOKEN;

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

const MAX_CHUNK_SIZE = 25 * 1024 * 1024;

async function uploadFileInChunksAndDelete(
  filePath,
  fileName,
  destinationChannelId
) {
  try {
    // Read the file as binary
    const destinationChannel = client.channels.cache.get(destinationChannelId);
    const file = await readFileAsBuffer(filePath);

    const totalChunks = Math.ceil(file.length / MAX_CHUNK_SIZE);

    // Upload each chunk sequentially
    let startByte = 0;
    let endByte = MAX_CHUNK_SIZE;
    const uploadedUrls = [];

    for (let i = 0; i < totalChunks; i++) {
      const chunk = file.slice(startByte, endByte);
      const _filename = fileName.split(".")[0] + "_" + i + ".txt";
      const uploadedUrl = await sendFileToDiscord(
        destinationChannel,
        chunk,
        _filename
      );
      uploadedUrls.push(uploadedUrl);

      // Move to the next chunk
      startByte = endByte;
      endByte = Math.min(startByte + MAX_CHUNK_SIZE, file.length);
    }

    // Delete the original file after successful upload
    fs.unlinkSync(filePath);
    // console.log(uploadedUrls);
    return uploadedUrls;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
}

async function sendFileToDiscord(destinationChannel, file, fileName) {
  const message = await destinationChannel.send({
    files: [
      {
        attachment: file,
        name: fileName,
      },
    ],
  });

  if (message.attachments.size > 0) {
    const attachment = message.attachments.first();
    return attachment.url;
  } else {
    console.error("No attachments found in the sent message.");
    return null;
  }
}

async function readFileAsBuffer(filePath) {
  try {
    // Read the file as binary
    const fileContent = await fs.promises.readFile(filePath);
    return fileContent;
  } catch (error) {
    console.error("Error reading file as buffer:", error);
    return null;
  }
}

//sends the file
// async function sendFile(filePath, fileName) {
//   const destinationChannel = client.channels.cache.get(destinationChannelId);
//   console.log(destinationChannelId);
//   if (!destinationChannel) {
//     console.error("Destination channel not found.");
//     return;
//   }

//   try {
//     if (!fs.existsSync(filePath)) {
//       console.error("File not found:", filePath);
//       return;
//     }

//     const fileContent = fs.readFileSync(filePath);
//     const message = await destinationChannel.send({
//       files: [
//         {
//           attachment: fileContent,
//           name: path.basename(filePath), // Use the filename from the path
//         },
//       ],
//     });

//     if (message.attachments.size > 0) {
//       const attachment = message.attachments.first();
//       console.log("Download URL:", attachment.url);
//     } else {
//       console.error("No attachments found in the sent message.");
//     }
//   } catch (error) {
//     console.error("Error occurred while sending file:", error);
//   }
// }

function encryptContent(content) {
  const encryptionKey = crypto.randomBytes(32).toString("hex");
  console.log(`encryption key -- ${encryptionKey}`);
  const iv = crypto.randomBytes(16); // Generate a random IV (Initialization Vector)
  console.log(`iv -- ${iv}`);
  const cipher = crypto.createCipheriv(
    "aes-256-ctr",
    Buffer.from(encryptionKey, "hex"),
    iv
  );
  let encryptedContent = cipher.update(content, "utf8", "hex");
  encryptedContent += cipher.final("hex");
  return iv.toString("hex") + encryptedContent; // Prepend IV to the encrypted content
}

client.on("ready", (c) => {
  console.log(`👀 ${c.user.tag} is online`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) {
    return;
  }
  console.log(message.content);
  if (message.content === "hello") {
    message.reply("hello");
  }
});

client.login(token.toString());

module.exports = { uploadFileInChunksAndDelete };
