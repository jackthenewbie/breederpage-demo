const multer = require('multer');
const path = require('path');
const fs = require('fs');
const listRclone = require('#Controller/Utils/Rclone/List');
const copyRclone = require('#Controller/Utils/Rclone/Copy');
// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = `${process.env.UPLOAD_PATH}/${req.session.user._id}`;
    // Create the directory if it doesn't exist
    fs.mkdir(uploadDir, { recursive: true }, (err) => {
      if (err) {
        console.error("Error creating directory:", err);
        cb(err, null);
      } else {
        cb(null, uploadDir);
      }
    });
  },
  filename: function (req, file, cb) {
    // Extract the file extension
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + ext);
  }
});

function extFilter(allowedExtensions){
  return function (req, file, cb) {

  const fileExtension = path.extname(file.originalname).toLowerCase();

    if (fileExtension && allowedExtensions.includes(fileExtension)) {
        cb(null, true); // Accept the file.
    } else {
        const error = new Error(`Invalid file type. Only ${allowedExtensions.join(', ')} files are permitted.`);
        error.code = 'LIMIT_FILE_TYPE';
        cb(error, false); // Reject the file.
    }

}}

function upload(allowedExtensions, fields){
    return multer({
        storage: storage,
        limits: { fileSize: 20000000 }, // 20 MB file size limit
        fileFilter: extFilter(allowedExtensions)
    }).fields(fields)
}

exports.uploadFile = (allowedExtensions, fields, nameField) => {
    const uploader = upload(allowedExtensions, fields)
    return (req, res, next) => {
      uploader(req, res, (err) => {
        if (!err) {
          const srcRemote = req.files[nameField][0]['path'];
          console.log(srcRemote);
          copyRclone.copyRclone(srcRemote, srcRemote)
          .then(
            res.render('breeder/index', {
              pageTitle: "Breeders",
              uploadStatus: "Uploaded"
            })
          )
          .catch(
            error => err = error
          )
        } 
        if (err) { 
          console.error(err);
          console.log('Could not upload');
          return res.redirect('/pageNotFound');
        }
      });
    }  
}