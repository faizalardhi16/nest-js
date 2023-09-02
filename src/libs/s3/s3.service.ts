import { PutObjectCommand,  S3 } from '@aws-sdk/client-s3';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {v4 as uuidv4} from 'uuid';

@Injectable()
export class S3Service {
    constructor(@Inject('S3_CONFIG') private s3: S3, private config: ConfigService){}

    async uploadFile(file:Buffer, mimeType: string): Promise<string>{
        try {
            const filename = `${uuidv4()}.${mimeType.split("/")[1]}`
            const params = {
                Bucket: this.config.get("AWS_BUCKET_NAME"),
                Key: filename,
                Body: file
            }

            await this.s3.send(new PutObjectCommand(params));
            return filename
        } catch (error) {
            throw error
        }
    }

}
