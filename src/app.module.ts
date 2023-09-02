import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from 'src/libs/prisma/prisma.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from 'src/libs/database/database.module';
import { AssessmentModule } from './assessment/assessment.module';
import { InterviewModule } from './interview/interview.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { S3Module } from 'src/libs/s3/s3.module';
import { CategoryModule } from './category/category.module';
import { QuestionModule } from './question/question.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..'),
    }),
    AuthModule, 
    CategoryModule,
    PrismaModule, 
    UserModule, 
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }), 
    DatabaseModule, AssessmentModule, InterviewModule, S3Module, QuestionModule
  ],
})
export class AppModule {}
