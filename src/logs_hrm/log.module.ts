import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, LogSchema } from './log.schema';
import { LogService } from './log.service';
import { LogController } from './log.controller';


@Module({
  imports: [MongooseModule.forFeature([{ name: 'Log', schema: LogSchema }])],
  providers: [LogService],
  controllers: [LogController],
  exports: [LogService],
})
export class LogModule {}