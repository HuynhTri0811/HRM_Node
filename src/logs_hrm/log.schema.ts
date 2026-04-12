import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type LogDocument = Log & Document;

@Schema({ collection: 'logs', timestamps: true })
export class Log {
  @Prop({ required: true })
  level: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop()
  context?: string;

  @Prop()
  userId?: string;

  @Prop()
  ip?: string;

  @Prop()
  method?: string;

  @Prop()
  url?: string;

  @Prop()
  statusCode?: number;

  @Prop()
  responseTime?: number;

  @Prop()
  error?: string;

  @Prop({ type: Object })
  metadata?: any;
}

export const LogSchema = SchemaFactory.createForClass(Log);