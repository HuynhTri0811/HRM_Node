import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Log } from './log.schema';
import { LogDto } from './log.dto';
import { LogService } from './log.service';

@ApiTags('logs')
@Controller('logs')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get()
  @ApiOperation({ summary: 'Get all logs' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of logs to return' })
  @ApiResponse({ status: 200, description: 'List of logs', type: [LogDto] })
  findAll(@Query('limit') limit?: string): Promise<Log[]> {
    const limitNum = limit ? parseInt(limit, 10) : 100;
    return this.logService.findAll(limitNum);
  }

  @Get('level/:level')
  @ApiOperation({ summary: 'Get logs by level' })
  @ApiResponse({ status: 200, description: 'List of logs by level', type: [LogDto] })
  findByLevel(@Param('level') level: string, @Query('limit') limit?: string): Promise<Log[]> {
    const limitNum = limit ? parseInt(limit, 10) : 100;
    return this.logService.findByLevel(level, limitNum);
  }

  @Get('context/:context')
  @ApiOperation({ summary: 'Get logs by context' })
  @ApiResponse({ status: 200, description: 'List of logs by context', type: [LogDto] })
  findByContext(@Param('context') context: string, @Query('limit') limit?: string): Promise<Log[]> {
    const limitNum = limit ? parseInt(limit, 10) : 100;
    return this.logService.findByContext(context, limitNum);
  }
}