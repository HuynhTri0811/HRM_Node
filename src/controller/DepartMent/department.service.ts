import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogService } from '../../logs_hrm/log.service';
import { Department } from './deparment.entity';
import { CreateDepartmentDto } from './department.dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    private logService: LogService,
  ) { }

  async findAll(limit: number = 100, page: number = 1): Promise<Department[]> {
    const sanitizedLimit = Math.max(1, Math.min(limit, 1000));
    const sanitizedPage = Math.max(1, page);
    return await this.departmentRepository.find({
      where: { isDeleted: false },
      order: { createdAt: 'DESC' },
      skip: (sanitizedPage - 1) * sanitizedLimit,
      take: sanitizedLimit,
    });
  }


      async create(departmentData: CreateDepartmentDto): Promise<Department> {
          try {
              // Validate required fields
              if (!departmentData.tenPhongBan) {
                  const errorMsg = 'Tên phòng ban là bắt buộc';
                  await this.logService.create({
                      level: 'warn',
                      message: `Department creation failed: ${errorMsg}`,
                      context: 'Department',
                      metadata: { input: departmentData },
                  });
                  throw new Error(errorMsg);
              }
  

  
              if (existingNhanSu) {
                  const errorMsg = 'Email đã tồn tại trong hệ thống';
                  await this.logService.create({
                      level: 'warn',
                      message: `NhanSu creation failed: ${errorMsg} - ${nhanSuData.email}`,
                      context: 'NhanSu',
                      metadata: { email: nhanSuData.email },
                  });
                  throw new Error(errorMsg);
              }
  
              // Validate password
              if (!nhanSuData.password || nhanSuData.password.length < 8) {
                  const errorMsg = 'Mật khẩu phải có ít nhất 8 ký tự';
                  await this.logService.create({
                      level: 'warn',
                      message: `NhanSu creation failed: ${errorMsg}`,
                      context: 'NhanSu',
                      metadata: { input: nhanSuData },
                  });
                  throw new Error(errorMsg);
              }
  
              // Set default values
              const nhanSuToCreate = {
                  ...nhanSuData,
                  password: this.hashPassword(nhanSuData.password),
                  trangThai: nhanSuData.trangThai || 'active',
                  isDeleted: false,
                  phongBan: nhanSuData.phongBan ? { id: nhanSuData.phongBan } : undefined,
              };
  
              // Validate email format (basic validation)
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(nhanSuData.email)) {
                  const errorMsg = 'Email không hợp lệ';
                  await this.logService.create({
                      level: 'warn',
                      message: `NhanSu creation failed: ${errorMsg} - ${nhanSuData.email}`,
                      context: 'NhanSu',
                  });
                  throw new Error(errorMsg);
              }
  
              // Validate phone number format if provided
              if (nhanSuData.soDienThoai) {
                  const phoneRegex = /^[0-9+\-\s()]+$/;
                  if (!phoneRegex.test(nhanSuData.soDienThoai)) {
                      const errorMsg = 'Số điện thoại không hợp lệ';
                      await this.logService.create({
                          level: 'warn',
                          message: `NhanSu creation failed: ${errorMsg}`,
                          context: 'NhanSu',
                      });
                      throw new Error(errorMsg);
                  }
              }
  
              // Validate salary if provided
              if (nhanSuData.luongCoBan !== undefined && nhanSuData.luongCoBan < 0) {
                  const errorMsg = 'Lương cơ bản không được âm';
                  await this.logService.create({
                      level: 'warn',
                      message: `NhanSu creation failed: ${errorMsg}`,
                      context: 'NhanSu',
                  });
                  throw new Error(errorMsg);
              }
  
              const nhanSu = this.nhanSuRepository.create(nhanSuToCreate);
              const savedNhanSu = await this.nhanSuRepository.save(nhanSu);
              //delete savedNhanSu.password; // Remove password from returned object
  
              // Log successful creation
              await this.logService.create({
                  level: 'info',
                  message: `NhanSu created successfully: ${savedNhanSu.id} - ${nhanSuData.hoTen} (${nhanSuData.email})`,
                  context: 'NhanSu',
                  metadata: { nhanSuId: savedNhanSu.id, hoTen: nhanSuData.hoTen, email: nhanSuData.email },
              });
  
              return savedNhanSu;
          } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Unknown error';
              await this.logService.create({
                  level: 'error',
                  message: `NhanSu creation error: ${errorMessage}`,
                  context: 'NhanSu',
                  error: errorMessage,
                  metadata: { input: nhanSuData },
              });
              throw error;
          }
      }
}