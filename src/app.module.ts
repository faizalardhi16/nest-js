import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmartModule } from './bookmart/bookmart.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [AuthModule, UserModule, BookmartModule, BookingModule],
})
export class AppModule {}
