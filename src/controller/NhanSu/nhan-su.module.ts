import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NhanSu } from './nhan-su.entity';
import { NhanSuController } from './nhan-su.controller';
import { NhanSuService } from './nhan-su.service';
import { LogModule } from '../../logs_hrm/log.module';

@Module({
  imports: [TypeOrmModule.forFeature([NhanSu]), LogModule],
  providers: [NhanSuService],
  controllers: [NhanSuController],
  exports: [TypeOrmModule, NhanSuService],
})
export class NhanSuModule {}