import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { AssessmentModule } from './assessment/assessment.module';
import { InterviewModule } from './interview/interview.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { S3Service } from './s3/s3.service';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..'),
    }),
    AuthModule, 
    PrismaModule, 
    UserModule, 
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }), 
    DatabaseModule, AssessmentModule, InterviewModule, S3Module
  ],
})
export class AppModule {}
