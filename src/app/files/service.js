import {
  cloud_config,
  cloudinary,
  Readable,
} from "../../utils/cloudinary-config/index.js";

class FileService {
  upload(file, fileName, type = "image") {
    
    cloud_config();

    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(fileName);
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: fileName,
          resource_type: type,
        },
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      );

      const buffer = new Readable();
      buffer.push(file.buffer);
      buffer.push(null);
      buffer.pipe(uploadStream);
    });
  }
}

export const fileService = new FileService();
