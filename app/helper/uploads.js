const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const fs = require('fs');

// Configure AWS SDK for S3
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new aws.S3();

// Multer setup for local disk storage
const localStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './public/uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Multer setup for S3 storage
const s3Storage = multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME, 
    acl: 'public-read',
    key: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// File type checking function
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Function to choose storage dynamically
const uploadImage = (storageType) => {
    const storage = storageType === 's3' ? s3Storage : localStorage;
    return multer({
        storage: storage,
        limits: { fileSize: 1000000 }, // 1GB size limit
        fileFilter: (req, file, cb) => {
            checkFileType(file, cb);
        }
    }).any();  
};

module.exports = uploadImage;



{/* <div className='d-flex justify-content-center'>
                                  <img
                                    src={image.image_url}
                                    // src={"/uploads/images-1728537948296.jpg"}
                                    alt="image"
                                    style={{ maxWidth: '80px', height: 'auto', margin: "5px" }}
                                  />
                                </div> */}