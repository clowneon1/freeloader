const fs = require("fs");
const { Client, IntentsBitField } = require("discord.js");
const token = process.env.TOKEN;
const encdec = require("../encdec/encdec");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

const MAX_CHUNK_SIZE = 25 * 1024 * 1024;

const uploadFileInChunksAndDelete = async (
  filePath,
  fileName,
  destinationChannelId
) => {
  try {
    // Read the file as binary
    const destinationChannel = client.channels.cache.get(destinationChannelId);
    const file = await readFileAsBuffer(filePath);

    const totalChunks = Math.ceil(file.length / MAX_CHUNK_SIZE);

    // Upload each chunk sequentially
    let startByte = 0;
    let endByte = MAX_CHUNK_SIZE;
    const uploadedUrls = [];
    // const encfile = await encdec.encryptFile(file);

    for (let i = 0; i < totalChunks; i++) {
      const chunk = file.slice(startByte, endByte);
      const _filename = fileName.split(".")[0] + "_" + i + ".enc";

      console.log(`pushing to discord: ${i + 1}/${totalChunks}: ${_filename}`);

      const uploadedUrl = await sendFileToDiscord(
        destinationChannel,
        Buffer.from(chunk),
        _filename
      );
      uploadedUrls.push(uploadedUrl);
      // console.log(`pushed to discord : ${i + 1}/${totalChunks}: ${_filename}`);
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
};

const sendFileToDiscord = async (destinationChannel, file, fileName) => {
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
};

const readFileAsBuffer = async (filePath) => {
  try {
    // Read the file as binary
    const fileContent = await fs.promises.readFile(filePath);
    return fileContent;
  } catch (error) {
    console.error("Error reading file as buffer:", error);
    return null;
  }
};

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
