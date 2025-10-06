import { BucketTypes } from "../constants/buckets";

export type FileFolder = 'image' | 'voice';
export type FileKey = `${FileFolder}/${string}`;

export interface FileEntity {
	bucket: BucketTypes,
	key: FileKey,
}