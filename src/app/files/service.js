import {
  cloud_config,
  cloudinary,
  Readable,
} from "../../utils//configs/cloudinary-config/index.js";

class FileService {
  upload(file, fileName, type = "image") {
    cloud_config();

    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(fileName);

      const options = {
        public_id: fileName,
        resource_type: type,
        chunk_size: 6000000, 
      };

      const uploadStream =
        // type === "video"
        //   ? cloudinary.uploader.upload_large_stream(options, callback)
           cloudinary.uploader.upload_stream(options, callback);

      function callback(error, result) {
        if (error) return reject(error);
        resolve(result);
      }

      const buffer = new Readable();
      buffer.push(file.buffer);
      buffer.push(null);
      buffer.pipe(uploadStream);
    });
  }
}

export const fileService = new FileService();
