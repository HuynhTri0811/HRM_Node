import { Body, Controller, DefaultValuePipe, Get, HttpException, HttpStatus, ParseIntPipe, Post, Query } from '@nestjs/common';
import { Department } from './deparment.entity';
import { LogService } from 'src/logs_hrm/log.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './department.dto';
import { NhanSu } from '../NhanSu/nhan-su.entity';

@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all departments' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of records per page', example: 100 })
  @ApiResponse({ status: 200, description: 'List of all departments', type: [Department] })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit = 100,
  ): Promise<Department[]> {
    return this.departmentService.findAll(limit, page);
  }


  @Post()
  @ApiOperation({ summary: 'Create new department' })
  @ApiBody({
    type: CreateDepartmentDto,
    description: 'Department data to create',
    examples: {
      'full-example': {
        summary: 'Complete department data',
        value: {
          Code_Department: 'DEPT001',
          Name_Department: 'Phòng Kinh Doanh',
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Personnel created successfully', type: Department })
    @ApiResponse({ status: 400, description: 'Bad request - validation error' })
    @ApiResponse({ status: 409, description: 'Conflict - email already exists' })
  async create(@Body() createDepartmentDto: CreateDepartmentDto): Promise<Department> {
      try {
        return await this.departmentService.create(createDepartmentDto);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        if (errorMessage.includes('đã tồn tại')) {
          throw new HttpException(errorMessage, HttpStatus.CONFLICT);
        }
        throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
      }
    }
}
    