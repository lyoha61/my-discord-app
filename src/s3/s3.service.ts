import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BucketTypes } from 'src/common/constants/buckets';

@Injectable()
export class S3Service {
	private readonly s3Client: S3Client

	constructor(private configService: ConfigService) {
		const endpoint = this.configService.get<string>('MINIO_ENDPOINT');
    const accessKey = this.configService.get<string>('MINIO_ACCESS_KEY');
    const secretKey = this.configService.get<string>('MINIO_SECRET_KEY');

		if (!endpoint || !accessKey || !secretKey) {
      throw new Error('MinIO configuration missing despite validation');
    }

		this.s3Client = new S3Client({
				endpoint, 
				region: this.configService.get<string>("MINIO_REGION")!,
				credentials: {
					accessKeyId: accessKey,
					secretAccessKey: secretKey,
				},
				forcePathStyle: true,
			})
		}

		async uploadFile(bucket: BucketTypes, key: string, body: Buffer): Promise< string > {
			await this.s3Client.send(
				new PutObjectCommand({
					Bucket: bucket,
					Key: key,
					Body: body,
				})
			);

			return `${this.configService.get('MINIO_ENDPOINT')}/${bucket}/${key}`;
		}
	}

