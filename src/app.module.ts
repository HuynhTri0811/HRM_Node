import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { NhanSuModule } from './controller/NhanSu/nhan-su.module';
import { LogModule } from './logs_hrm/log.module';
import { AuthModule } from './auth/auth.module';
import { LoggingInterceptor } from './common/logging.interceptor';
import configuration from './config/configuration';
import { DepartmentModule } from './controller/DepartMent/deparment.module';
import { Company } from './controller/DepartMent/company.entity';
import { CompanyModule } from './controller/DepartMent/company.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),
    DatabaseModule,
    NhanSuModule,
    LogModule,
    AuthModule,
    DepartmentModule,
    CompanyModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
