import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LogDto {
  @ApiProperty({ description: 'Log level', example: 'info' })
  level: string;

  @ApiProperty({ description: 'Log message', example: 'GET /api/users - 200' })
  message: string;

  @ApiProperty({ description: 'Timestamp', example: '2024-01-01T00:00:00.000Z' })
  timestamp: Date;

  @ApiPropertyOptional({ description: 'Context', example: 'HTTP' })
  context?: string;

  @ApiPropertyOptional({ description: 'User ID', example: 'user123' })
  userId?: string;

  @ApiPropertyOptional({ description: 'IP address', example: '192.168.1.1' })
  ip?: string;

  @ApiPropertyOptional({ description: 'HTTP method', example: 'GET' })
  method?: string;

  @ApiPropertyOptional({ description: 'URL', example: '/api/users' })
  url?: string;

  @ApiPropertyOptional({ description: 'Status code', example: 200 })
  statusCode?: number;

  @ApiPropertyOptional({ description: 'Response time in ms', example: 150 })
  responseTime?: number;

  @ApiPropertyOptional({ description: 'Error message', example: 'Database connection failed' })
  error?: string;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: any;
}