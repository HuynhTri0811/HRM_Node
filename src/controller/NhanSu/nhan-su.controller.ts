import { Controller, Get, Post, Body, Param, Put, Delete, HttpException, HttpStatus, DefaultValuePipe, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { NhanSu } from './nhan-su.entity';
import { NhanSuService } from './nhan-su.service';
import { CreateNhanSuDto, UpdateNhanSuDto } from './nhan-su.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('nhan-su')
@Controller('nhan-su')
export class NhanSuController {
  constructor(private readonly nhanSuService: NhanSuService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all personnel' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of records per page', example: 100 })
  @ApiResponse({ status: 200, description: 'List of all personnel', type: [NhanSu] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit = 100,
  ): Promise<NhanSu[]> {
    return this.nhanSuService.findAll(limit, page);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get personnel by ID' })
  @ApiParam({ name: 'id', description: 'Personnel ID' })
  @ApiResponse({ status: 200, description: 'Personnel details', type: NhanSu })
  @ApiResponse({ status: 404, description: 'Personnel not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(@Param('id') id: string): Promise<NhanSu | null> {
    const nhanSu = await this.nhanSuService.findOne(+id);
    if (!nhanSu) {
      throw new HttpException('Nhân sự không tồn tại', HttpStatus.NOT_FOUND);
    }
    return nhanSu;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create new personnel' })
  @ApiBody({
    type: CreateNhanSuDto,
    description: 'Personnel data to create',
    examples: {
      'full-example': {
        summary: 'Complete personnel data',
        value: {
          hoTen: 'Nguyễn Văn A',
          email: 'nguyenvana@example.com',
          soDienThoai: '0123456789',
          diaChi: '123 Đường ABC, Quận 1, TP.HCM',
          ngaySinh: '1990-01-01',
          chucVu: 'Nhân viên kinh doanh',
          phongBan: 1,
          ngayVaoLam: '2023-01-15',
          luongCoBan: 15000000,
          trangThai: 'active',
          password: 'P@ssw0rd123'
        }
      },
      'minimal-example': {
        summary: 'Minimal required data',
        value: {
          hoTen: 'Nguyễn Văn A',
          email: 'nguyenvana@example.com'
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Personnel created successfully', type: NhanSu })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 409, description: 'Conflict - email already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createNhanSuDto: CreateNhanSuDto): Promise<NhanSu> {
    try {
      return await this.nhanSuService.create(createNhanSuDto);
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update personnel' })
  @ApiParam({ name: 'id', description: 'Personnel ID' })
  @ApiBody({ type: UpdateNhanSuDto, description: 'Personnel data to update' })
  @ApiResponse({ status: 200, description: 'Personnel updated successfully', type: NhanSu })
  @ApiResponse({ status: 404, description: 'Personnel not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(@Param('id') id: string, @Body() updateNhanSuDto: UpdateNhanSuDto): Promise<NhanSu> {
    try {
      return await this.nhanSuService.update(+id, updateNhanSuDto);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage === 'NhanSu not found') {
        throw new HttpException('Nhân sự không tồn tại', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }



  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete personnel' })
  @ApiParam({ name: 'id', description: 'Personnel ID' })
  @ApiResponse({ status: 200, description: 'Personnel deleted successfully' })
  @ApiResponse({ status: 404, description: 'Personnel not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async remove(@Param('id') id: string): Promise<void> {
    try {
      await this.nhanSuService.remove(+id);
    } catch (error) {
      throw new HttpException('Nhân sự không tồn tại', HttpStatus.NOT_FOUND);
    }
  }
}