const multer = require("multer");
const path = require("path");

const uploadMiddleware = ({ destination, uploadType, field }) => {
  const storage = multer.diskStorage({
    destination,
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    },
  });

  const upload = multer({ storage });

  switch (uploadType) {
    case "array":
      return upload.array(field);
    case "single":
      return upload.single(field);
    default:
      return upload.single(field);
  }
};

module.exports = uploadMiddleware;
