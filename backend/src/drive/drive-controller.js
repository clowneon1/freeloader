require("dotenv").config();
const freeloader = require("../discordbot/freeloader");
const FileProperties = require("../schema/file-properties");
const destinationChannelId = process.env.CHANNEL_ID;
const axios = require("axios");
const encdec = require("../encdec/encdec");
const path = require("path");
const fs = require("fs");

const downloadFile = async (req, res) => {
  console.log(`downloading files from the server`);
  const fileId = req.params.id;
  try {
    const fileData = await FileProperties.findById(fileId);
    const originalFilename = fileData.name;
    console.log(originalFilename);
    const fileUrls = fileData.fileUrls;
    const fileChunks = [];
    for (const url of fileUrls) {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      fileChunks.push(response.data);
    }
    console.log(`stiching files`);
    const stitchedBuffer = Buffer.concat(fileChunks);
    const stitchedFile = path.join(__dirname, "stitchedFile.txt");
    fs.writeFileSync(stitchedFile, stitchedBuffer);
    // Decrypt the file
    console.log(`decrypting file`);
    console.log(stitchedFile);
    // const decryptedFilePath = await encdec.decryptFile(stitchedFile);

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + originalFilename
    );
    // Send the decrypted file as a response with the original filename
    res.download(stitchedFile, originalFilename, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).send("Internal Server Error");
      } else {
        // Clean up decrypted file after response has been sent
        fs.unlinkSync(stitchedFile);
      }
    });
  } catch (error) {
    console.error("Error downloading, stitching, and decoding files:", error);
    res.status(500).send("Internal Server Error");
  }
};
// =========================

const getFilesProperties = async (req, res) => {
  const filesProps = await FileProperties.find({});
  // console.log(filesProps);
  console.log(`returning fileprops`);
  return res.status(200).json(filesProps);
};

const upload = async (req, res) => {
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
  downloadFile,
};
