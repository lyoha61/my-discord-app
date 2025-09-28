import { BucketTypes } from "src/common/constants/buckets";

export interface UploadFile {
	key: string;
	url: string;
	bucket: BucketTypes;
	filename: string;
	mimetype: string;
	size: number;
}