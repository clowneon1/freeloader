const express = require("express");
const driveController = require("./drive-controller");
const router = express.Router();
const multer = require("multer");

// //get
// // router.get("/", driveController.getList);

const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "/uploads"));
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
