import { Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { Department } from './deparment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './department.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Permissions } from 'src/auth/permissions.decorator';
import { PermissionsGuard } from 'src/auth/permissions.guard';

@ApiTags('department')
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all departments' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of records per page', example: 100 })
  @ApiResponse({ status: 200, description: 'List of all departments', type: [Department] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit = 100,
  ): Promise<Department[]> {
    return this.departmentService.findAll(limit, page);
  }


  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
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
  @ApiResponse({ status: 201, description: 'Department created successfully', type: Department })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 409, description: 'Conflict - department already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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


  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('department', 'delete')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a department (requires permission)' })
  @ApiResponse({ status: 200, description: 'Department deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      return await this.departmentService.delete(id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('đã tồn tại')) {
        throw new HttpException(errorMessage, HttpStatus.CONFLICT);
      }
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }
}
    