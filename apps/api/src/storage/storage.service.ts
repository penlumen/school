import { Injectable, Logger } from '@nestjs/common';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import sharp from 'sharp';
import { randomUUID } from 'crypto';

export interface UploadedFile {
  key: string;
  url: string;
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicBaseUrl: string;

  constructor() {
    this.bucket = process.env.AWS_S3_BUCKET || '';
    this.client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: process.env.AWS_ACCESS_KEY_ID
        ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
          }
        : undefined,
      // Supports S3-compatible providers (e.g. Cloudflare R2, MinIO) via AWS_S3_ENDPOINT.
      endpoint: process.env.AWS_S3_ENDPOINT || undefined,
      forcePathStyle: !!process.env.AWS_S3_ENDPOINT,
    });
    // e.g. https://<bucket>.s3.<region>.amazonaws.com or a CDN domain in front of the bucket.
    this.publicBaseUrl =
      process.env.AWS_S3_PUBLIC_URL || `https://${this.bucket}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com`;
  }

  /**
   * Compresses an incoming image to webp and uploads it to S3.
   * Used for every passport/profile photo upload (students, staff, parents).
   */
  async uploadImage(
    buffer: Buffer,
    folder: string,
    options?: { maxWidth?: number; quality?: number },
  ): Promise<UploadedFile> {
    const maxWidth = options?.maxWidth ?? 800;
    const quality = options?.quality ?? 80;

    const webpBuffer = await sharp(buffer)
      .rotate() // respect EXIF orientation before stripping metadata
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality })
      .toBuffer();

    const key = `${folder}/${randomUUID()}.webp`;

    await new Upload({
      client: this.client,
      params: {
        Bucket: this.bucket,
        Key: key,
        Body: webpBuffer,
        ContentType: 'image/webp',
      },
    }).done();

    this.logger.log(`Uploaded ${key} (${webpBuffer.length} bytes)`);

    return { key, url: `${this.publicBaseUrl}/${key}` };
  }

  async delete(key: string): Promise<void> {
    if (!key) return;
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }

  /** Extracts the S3 key back out of a public URL produced by uploadImage(). */
  keyFromUrl(url: string | null | undefined): string | null {
    if (!url || !url.startsWith(this.publicBaseUrl)) return null;
    return url.slice(this.publicBaseUrl.length + 1);
  }
}
