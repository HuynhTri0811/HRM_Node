import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { NhanSuModule } from '../controller/NhanSu/nhan-su.module';
import { LogModule } from '../logs_hrm/log.module';

@Module({
  imports: [NhanSuModule, LogModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
