import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log } from './log.schema';

@Injectable()
export class LogService {
  constructor(
    @InjectModel('Log')
    private logModel: Model<Log>,
  ) {}

  async create(logData: Partial<Log>): Promise<Log> {
    const log = new this.logModel(logData);
    return log.save();
  }

  async findAll(limit: number = 100): Promise<Log[]> {
    return this.logModel.find().sort({ timestamp: -1 }).limit(limit).exec();
  }

  async findByLevel(level: string, limit: number = 100): Promise<Log[]> {
    return this.logModel.find({ level }).sort({ timestamp: -1 }).limit(limit).exec();
  }

  async findByContext(context: string, limit: number = 100): Promise<Log[]> {
    return this.logModel.find({ context }).sort({ timestamp: -1 }).limit(limit).exec();
  }

  async deleteOldLogs(days: number = 30): Promise<any> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return this.logModel.deleteMany({ timestamp: { $lt: cutoffDate } }).exec();
  }
}