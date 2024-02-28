require("dotenv").config();
const { default: mongoose } = require("mongoose");
const freeloader = require("../discordbot/freeloader");
const FileProperties = require("../schema/file-properties");
const destinationChannelId = process.env.CHANNEL_ID;

getFilesProperties = async (req, res) => {
  const filesProps = await FileProperties.find({});
  console.log(filesProps);
  console.log("returning");
  return res.status(200).json(filesProps);
};

upload = async (req, res) => {
  try {
    const files = req.files; // an array of all the files that were uploaded

    // Assuming you have a Discord bot instance named 'discordBot'
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Assuming you have a function to send file to Discord bot named 'sendFileToDiscordBot'
      // console.log(`${file.size} \ ${file.filename}`);

      const filePath = file.destination + "\\" + file.filename;
      console.log(`${filePath} is processing right now`);
      const uploadUrls = await freeloader.uploadFileInChunksAndDelete(
        filePath,
        file.filename,
        destinationChannelId
      );
      putFilePropertiesInDB(file.filename, file.size, uploadUrls);
    }

    console.log("All files sent to Discord bot successfully.");
    return res.json({ status: "files received and sent to Discord bot" });
  } catch (error) {
    console.error("Error sending files to Discord bot:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const putFilePropertiesInDB = async (name, size, fileUrls) => {
  try {
    const date = Date.now();
    const fileProperties = new FileProperties({
      name,
      size,
      date,
      fileUrls,
    });
    await fileProperties.save();
    console.info(`File properties are uploaded to database sucessfully`);
  } catch (error) {
    console.log(error, "An error occurred while creating the File properties");
  }
};

module.exports = {
  upload,
  getFilesProperties,
};
