const multer = require('multer');
const path = require('path');

// Set Storage Engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // folder penyimpanan file yang diupload
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Penamaan file yang diupload
  }
});

// Filter untuk hanya menerima file gambar
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images are allowed (jpeg, jpg, png)!'));
  }
};

// Set up Multer middleware
const upload = multer({
  storage: storage,
  // fileFilter: fileFilter,
});


module.exports = 
{
   upload
}

module.exports = upload;
