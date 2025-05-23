import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

const cloud_config = () => {
  return cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  });
};

export { cloudinary, cloud_config, Readable };
