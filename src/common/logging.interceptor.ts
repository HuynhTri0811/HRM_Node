import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LogService } from '../logs_hrm/log.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logService: LogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const startTime = Date.now();

    const { method, url, ip, user } = request;
    const userId = user?.id || user?.sub;

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - startTime;
        this.logService.create({
          level: 'info',
          message: `${method} ${url} - ${response.statusCode}`,
          context: 'HTTP',
          userId,
          ip,
          method,
          url,
          statusCode: response.statusCode,
          responseTime,
        });
      }),
      catchError((error) => {
        const responseTime = Date.now() - startTime;
        this.logService.create({
          level: 'error',
          message: `${method} ${url} - ${error.status || 500} - ${error.message}`,
          context: 'HTTP',
          userId,
          ip,
          method,
          url,
          statusCode: error.status || 500,
          responseTime,
          error: error.message,
        });
        throw error;
      }),
    );
  }
}