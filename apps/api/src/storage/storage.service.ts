import { Injectable, Logger } from '@nestjs/common';
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
  S3Client,
  ObjectCannedACL,
  StorageClass,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import sharp from 'sharp';

export type StorageEntity = 'staff' | 'student' | 'parent';

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
      endpoint: process.env.AWS_S3_ENDPOINT || undefined,
      forcePathStyle: !!process.env.AWS_S3_ENDPOINT,
    });
    this.publicBaseUrl =
      process.env.AWS_S3_PUBLIC_URL ||
      `https://${this.bucket}.s3.${process.env.AWS_REGION || 'eu-west-2'}.amazonaws.com`;
  }

  /**
   * Every avatar has one deterministic S3 key. Uploading a replacement writes
   * to the exact same key, so there is never an old random object left behind.
   */
  avatarKey(
    schoolUuid: string,
    branchUuid: string,
    entity: StorageEntity,
    entityUuid: string,
  ): string {
    const folder = entity === 'staff' ? 'staffs' : `${entity}s`;
    return `storage/${schoolUuid}/${branchUuid}/${folder}/${entityUuid}/avatar.webp`;
  }

  async uploadAvatar(
    buffer: Buffer,
    schoolUuid: string,
    branchUuid: string,
    entity: StorageEntity,
    entityUuid: string,
    options?: { maxWidth?: number; quality?: number },
  ): Promise<UploadedFile> {
    const maxWidth = options?.maxWidth ?? 800;
    const quality = options?.quality ?? 80;
    const webpBuffer = await sharp(buffer)
      .rotate()
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality })
      .toBuffer();

    const key = this.avatarKey(schoolUuid, branchUuid, entity, entityUuid);

    await new Upload({
      client: this.client,
      params: {
        Bucket: this.bucket,
        Key: key,
        Body: webpBuffer,
        ContentType: 'image/webp',
        CacheControl: 'no-cache, max-age=0, must-revalidate',
        StorageClass: 'STANDARD' as StorageClass,
        ACL: 'public-read' as ObjectCannedACL,
      },
    }).done();

    this.logger.log(`Uploaded/replaced ${key} (${webpBuffer.length} bytes)`);
    return { key, url: `${this.publicBaseUrl}/${key}` };
  }

  async delete(key: string): Promise<void> {
    if (!key) return;
    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
  }

  async deleteAvatar(
    schoolUuid: string,
    branchUuid: string,
    entity: StorageEntity,
    entityUuid: string,
  ): Promise<void> {
    await this.delete(
      this.avatarKey(schoolUuid, branchUuid, entity, entityUuid),
    );
  }

  /** Delete every branch-scoped avatar for an account before the account is removed. */
  async deleteAccountAvatars(
    schoolUuid: string,
    entity: StorageEntity,
    entityUuid: string,
  ): Promise<void> {
    const folder = entity === 'staff' ? 'staffs' : `${entity}s`;
    const prefix = `${schoolUuid}/`;
    const suffix = `/${folder}/${entityUuid}/`;
    let continuationToken: string | undefined;

    do {
      const page = await this.client.send(
        new ListObjectsV2Command({
          Bucket: this.bucket,
          Prefix: prefix,
          ContinuationToken: continuationToken,
        }),
      );
      const keys = (page.Contents || [])
        .map((item) => item.Key)
        .filter(
          (key): key is string => !!key && key.endsWith(suffix + 'avatar.webp'),
        );

      if (keys.length) {
        await this.client.send(
          new DeleteObjectsCommand({
            Bucket: this.bucket,
            Delete: { Objects: keys.map((Key) => ({ Key })) },
          }),
        );
      }

      continuationToken = page.IsTruncated
        ? page.NextContinuationToken
        : undefined;
    } while (continuationToken);
  }

  /** Delete all branch-owned files, including student avatars. */
  async deleteBranchFiles(
    schoolUuid: string,
    branchUuid: string,
  ): Promise<void> {
    const prefix = `${schoolUuid}/${branchUuid}/`;
    let continuationToken: string | undefined;

    do {
      const page = await this.client.send(
        new ListObjectsV2Command({
          Bucket: this.bucket,
          Prefix: prefix,
          ContinuationToken: continuationToken,
        }),
      );
      const keys = (page.Contents || [])
        .map((item) => item.Key)
        .filter((key): key is string => !!key);

      if (keys.length) {
        await this.client.send(
          new DeleteObjectsCommand({
            Bucket: this.bucket,
            Delete: { Objects: keys.map((Key) => ({ Key })) },
          }),
        );
      }

      continuationToken = page.IsTruncated
        ? page.NextContinuationToken
        : undefined;
    } while (continuationToken);
  }

  keyFromUrl(url: string | null | undefined): string | null {
    if (!url || !url.startsWith(this.publicBaseUrl)) return null;
    return url.slice(this.publicBaseUrl.length + 1).split('?')[0];
  }
}
