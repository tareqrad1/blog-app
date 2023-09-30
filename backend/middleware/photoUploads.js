const path = require("path");
const multer = require("multer");

// upload image to file < images >
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../images")); // destination of images file 
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1]
        const fileName = `image-${Date.now()}.${ext}`;
        cb(null, fileName);
    }
})
// filtration 
function fileFilter (req, file, cb) {
    const imageType = file.mimetype.split('/')[0];
    if(imageType === 'image') {
        return cb(null, true);
    }else {
        return cb('Thats not a photo sorry !', false); 
    }
}

const photoUpload = multer({
    storage: diskStorage,
    fileFilter: fileFilter,
})

module.exports = photoUpload;