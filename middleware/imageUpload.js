const multer = require("multer");
const fs = require("fs");
const path = require("path");

const folderName = path.join(__dirname, "../assets");
if (!fs.existsSync(folderName)) {
  fs.mkdirSync(folderName);
}

const uploadImage = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "assets");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now() + ".csv");
    },
  }),
}).single("file");

module.exports = uploadImage;
