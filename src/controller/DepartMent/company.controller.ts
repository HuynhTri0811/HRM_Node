import { Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Department } from './deparment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto as CreateCompanyDto, UpdateDepartmentDto } from './department.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Permissions } from 'src/auth/permissions.decorator';
import { PermissionsGuard } from 'src/auth/permissions.guard';
import { CompanyService } from './company.service';
import { Company } from './company.entity';

@ApiTags('company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all companies' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of records per page', example: 100 })
  @ApiResponse({ status: 200, description: 'List of all companies', type: [Company] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit = 100,
  ): Promise<Company[]> {
    return this.companyService.findAll(limit, page);
  }




  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create new company' })
  @ApiBody({
    type: CreateCompanyDto,
    description: 'Company data to create',
    examples: {
      'full-example': {
        summary: 'Complete company data',
        value: {
          Code_Company: 'COMP001',
          Name_Company: 'Công ty ABC',
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Company created successfully', type: Company })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 409, description: 'Conflict - company already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createCompanyDto: CreateCompanyDto): Promise<Company> {
      try {
        return await this.companyService.create(createCompanyDto);
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
      return await this.companyService.delete(id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('đã tồn tại')) {
        throw new HttpException(errorMessage, HttpStatus.CONFLICT);
      }
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @Permissions('department', 'update')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a department (requires permission)' })
  @ApiResponse({ status: 200, description: 'Department updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateCompanyDto: CreateCompanyDto): Promise<Company> {
    try {
      return await this.companyService.update(id, updateCompanyDto  );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('đã tồn tại')) {
        throw new HttpException(errorMessage, HttpStatus.CONFLICT);
      }
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }

  // =============================================
  // DATA EXPORT ENDPOINTS USING STORED PROCEDURES
  // =============================================

  @Get('export/all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Export all companies data using stored procedure' })
  @ApiResponse({ status: 200, description: 'All companies data exported successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async exportAllCompanies() {
    try {
      return await this.companyService.exportAllCompanies();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('export/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Export company data by ID using stored procedure' })
  @ApiResponse({ status: 200, description: 'Company data exported successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async exportCompanyById(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.companyService.exportCompanyById(id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('not found')) {
        throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('export/paginated')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Export companies with pagination and search using stored procedure' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, description: 'Records per page', example: 10 })
  @ApiQuery({ name: 'search', required: false, description: 'Search text for company name or code' })
  @ApiResponse({ status: 200, description: 'Companies data with pagination exported successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async exportCompaniesWithPagination(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize = 10,
    @Query('search') search?: string,
  ) {
    try {
      return await this.companyService.exportCompaniesWithPagination(page, pageSize, search);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('export/json')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Export all companies data as JSON using stored procedure' })
  @ApiResponse({ status: 200, description: 'Companies data exported as JSON successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async exportCompaniesToJson() {
    try {
      return await this.companyService.exportCompaniesToJson();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('export/csv')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Export all companies data as CSV text using stored procedure' })
  @ApiResponse({ status: 200, description: 'Companies data exported as CSV successfully', content: { 'text/plain': {} } })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async exportCompaniesToCsv() {
    try {
      const csvData = await this.companyService.exportCompaniesToCsv();
      return csvData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
    