import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { logger } from "./logger";

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT || "",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export const uploadToR2 = async (
  file: Express.Multer.File,
  folder: string = "posts"
): Promise<string> => {
  const fileName = `${folder}/${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
  const bucketName = process.env.R2_BUCKET_NAME || "";

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  try {
    await r2Client.send(command);
    // Public URL format for Cloudflare R2
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${process.env.R2_BUCKET_NAME}/${fileName}`;
    return publicUrl;
  } catch (error) {
    logger.error("Error uploading to R2:", error);
    throw new Error("Failed to upload image to storage");
  }
};

export default r2Client;
