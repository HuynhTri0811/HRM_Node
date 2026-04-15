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
      try
      {
        const departmentToCreate = {
                ...departmentData,
                isDeleted: false,
            };
        const department = this.departmentRepository.create(departmentToCreate);
        return await this.departmentRepository.save(department);
      }
      catch
      {
        throw new Error('Error creating department');
      }
    }
     async delete(id: number): Promise<void> {
              const result = await this.departmentRepository.update(id, { isDeleted: true });
        if (result.affected === 0) {
            throw new Error('Department not found');
        }
    throw new Error('Method not implemented.');
  }
}