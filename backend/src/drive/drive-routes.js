const express = require("express");
const driveController = require("./drive-controller");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

// //get

router.get("/download/:id", driveController.downloadFile);
router.get("/drive", driveController.getFilesProperties);

const path = require("path");

//delete
router.delete("/delete/:id", driveController.deleteFile);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadFolder = path.join(__dirname, "/uploads");

    // Check if the upload folder exists, if not, create it
    fs.mkdir(uploadFolder, { recursive: true }, (err) => {
      if (err) {
        console.error("Error creating upload folder:", err);
        return cb(err);
      }
      cb(null, uploadFolder);
    });
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});

// const upload = multer({ dest: __dirname + "/uploads" });
const upload = multer({ storage: storage });

//post
// router.post("/upload", driveController.upload);
router.post("/upload", upload.array("files"), driveController.upload);

// router.get("/download/:id");

module.exports = router;
