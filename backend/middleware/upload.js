import multer from 'multer';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', 'uploads');

// check that uploads directory exists, create it if it doesn't
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
    // save file uploads in upload directory
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },

    // create new file name
    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname);
        const name = path.basename(file.originalname, extension);
        // create unique file name, format is originalname-randomuuid.pdf
        cb(null, name + '-' + crypto.randomUUID() + extension);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const allowedFileTypes = ['application/pdf', 'text/plain'];

    if (file.fieldname === 'image' && allowedImageTypes.includes(file.mimetype)) { // image is of valid file type
        cb(null, true);
    } else if (file.fieldname === 'file' && allowedFileTypes.includes(file.mimetype)) { // pattern file is of valid file type
        cb(null, true);
    } else {
        cb(new Error('Invalid file type.'));
    }
};

// limit file size to 50 MB (needed for large PDFs for some patterns)
const upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: 1024 * 1024 * 50 }});

// wrapper to catch multer errors and return a proper response
export function handleUpload(fields) {
    const multerMiddleware = upload.fields(fields);

    return (req, res, next) => {
        multerMiddleware(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: err.message });
            } else if (err) {
                return res.status(400).json({ message: err.message });
            }
            next();
        });
    };
}