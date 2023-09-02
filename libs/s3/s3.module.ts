import { Global, Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { ConfigService } from '@nestjs/config';
import {  S3 } from "@aws-sdk/client-s3"


const s3PoolFactory = async (configService: ConfigService) => {
    return new S3({
        region: configService.getOrThrow('AWS_REGION_NAME'),
        credentials: {
            accessKeyId: configService.getOrThrow('AWS_S3_ACCESS_KEY'),
            secretAccessKey: configService.getOrThrow('AWS_S3_SECRET_KEY')
        }
    })
};


@Global()
@Module({
    providers: [
        {
            provide: 'S3_CONFIG',
            inject: [ConfigService],
            useFactory: s3PoolFactory
        },
        S3Service
    ],
    exports: [S3Service]
})

export class S3Module {}
