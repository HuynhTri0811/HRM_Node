import { Controller, Get, Query, Param, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
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
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of logs to return', example: 100 })
  @ApiResponse({ status: 200, description: 'List of logs', type: [LogDto] })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit = 100,
  ): Promise<Log[]> {
    return this.logService.findAll(limit, page);
  }

  @Get('level/:level')
  @ApiOperation({ summary: 'Get logs by level' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of logs to return', example: 100 })
  @ApiResponse({ status: 200, description: 'List of logs by level', type: [LogDto] })
  findByLevel(
    @Param('level') level: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit = 100,
  ): Promise<Log[]> {
    return this.logService.findByLevel(level, limit, page);
  }

  @Get('context/:context')
  @ApiOperation({ summary: 'Get logs by context' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of logs to return', example: 100 })
  @ApiResponse({ status: 200, description: 'List of logs by context', type: [LogDto] })
  findByContext(
    @Param('context') context: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit = 100,
  ): Promise<Log[]> {
    return this.logService.findByContext(context, limit, page);
  }
}