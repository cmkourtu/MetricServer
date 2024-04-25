const multer = require("multer");
const path = require("path");

const storage = userId =>
    multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join(__dirname, "../public/avatars");
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const fileName = `${userId}_avatar${path.extname(file.originalname)}`;
            cb(null, fileName);
        },
    });
const fileFilter = (req, file, cb) => {
    const allowedFileExtensions = [".png", ".jpeg"];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (allowedFileExtensions.includes(fileExtension)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type. Only ${allowedFileExtensions} are allowed.`));
    }
};
const upload = userId =>
    multer({
        storage: storage(userId),
        fileFilter: fileFilter,
    }).single("avatar");

module.exports = {upload};
