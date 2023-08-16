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
    DatabaseModule, AssessmentModule, InterviewModule
  ],
})
export class AppModule {}
