const freeloader = require("../discordbot/freeloader");

const upload = async (req, res) => {
  try {
    const files = req.files; // an array of all the files that were uploaded

    // Assuming you have a Discord bot instance named 'discordBot'
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Assuming you have a function to send file to Discord bot named 'sendFileToDiscordBot'
      // console.log(`${file.destination} \ ${file.filename}`);
      const filePath = file.destination + "\\" + file.filename;
      console.log(filePath);
      await freeloader.sendFile(filePath, file.filename);
    }

    console.log("All files sent to Discord bot successfully.");
    return res.json({ status: "files received and sent to Discord bot" });
  } catch (error) {
    console.error("Error sending files to Discord bot:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  upload,
};
