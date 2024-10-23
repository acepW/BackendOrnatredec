const multer = require('multer');
const path = require('path');

// Set Storage Engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Folder penyimpanan file yang diupload
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Penamaan file yang diupload
  }
});

// Filter untuk hanya menerima file gambar dan video
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png/;
  const allowedVideoTypes = /mp4|mkv|avi/;
  const extname = allowedImageTypes.test(path.extname(file.originalname).toLowerCase()) || allowedVideoTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedImageTypes.test(file.mimetype) || allowedVideoTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (jpeg, jpg, png) and videos (mp4, mkv, avi) are allowed!'));
  }
};

// Set up Multer middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
