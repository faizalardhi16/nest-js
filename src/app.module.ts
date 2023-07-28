import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmartModule } from './bookmart/bookmart.module';
import { BookingModule } from './booking/booking.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, UserModule, BookmartModule, BookingModule, PrismaModule],
})
export class AppModule {}
