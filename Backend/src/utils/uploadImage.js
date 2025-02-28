const cloudinary = require('../config/cloudinary');

const uploadImage = async (buffer) => {
  try {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "ecommerce" }, 
        (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            reject(null);
          } else {
            resolve(result.secure_url);
          }
        }
      );

      stream.end(buffer);
    });
  } catch (error) {
    console.error("Upload Failed:", error);
    return null;
  }
};

module.exports = uploadImage;