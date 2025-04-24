import {
  Uploader,
  UploadParams,
} from "@/domain/forum/application/storage/uploader";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { EnvService } from "../env/env.service";
import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client;

  constructor(private envService: EnvService) {
    const accountId = envService.get("CLOUDFARE_ACCOUNT_ID");
    const accessKeyId = envService.get("AWS_ACCESS_KEY_ID");
    const secretAccessKey = envService.get("AWS_SECRET_ACCESS_KEY_ID");

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: "auto",
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async upload({
    fileName,
    fileType,
    body,
  }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID();
    const uniqueFileName = `${uploadId}-${fileName}`;
    const bucketName = this.envService.get("AWS_BUCKET_NAME");

    await this.client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      })
    );

    // More secure to save a reference to the file in the database, instead of the URL
    // Because the URL can be guessed and accessed by anyone.
    // And if you want to change the storage service, you will have to change the URL in the database but the file name not.

    return {
      url: uniqueFileName,
    };
  }
}
