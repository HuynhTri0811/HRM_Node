import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { LogService } from '../../logs_hrm/log.service';
import { Department } from './deparment.entity';
import { CreateDepartmentDto, UpdateDepartmentDto } from './department.dto';
import { Company } from './company.entity';
import { CreateCompanyDto } from './company.dto';

@Injectable()
export class CompanyService {

  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private logService: LogService,
    private dataSource: DataSource,
  ) { }

  async findAll_data(limit: number = 100, page: number = 1): Promise<Company []> {
    const sanitizedLimit = Math.max(1, Math.min(limit, 1000));
    const sanitizedPage = Math.max(1, page);
    return await this.companyRepository.find({
      where: { isDeleted: false },
      order: { createdAt: 'DESC' },
      skip: (sanitizedPage - 1) * sanitizedLimit,
      take: sanitizedLimit,
    });
  }


  async create_data(companyData: CreateCompanyDto): Promise<Company> {
    try {
      const companyToCreate = {
        ...companyData,
        isDeleted: false,
      };
      const company = this.companyRepository.create(companyToCreate);
      return await this.companyRepository.save(company);
    }
    catch {
      throw new Error('Error creating company');
    }

  }

  async update_Data(id: number, companyData: CreateCompanyDto): Promise<Company> {
    try {
      const companyUpdate = {
        ...companyData,
        isDeleted: false,
      };
      await this.companyRepository.update(id, companyUpdate);
      const company = await this.companyRepository.findOne({ where: { id, isDeleted: false } });
      if (!company) {
        throw new Error('Company not found');
      }
      return company;
    }
    catch {
      throw new Error('Error creating company');
    }

  }
  async delete_data(id: number): Promise<void> {
    const result = await this.companyRepository.update(id, { isDeleted: true });
    if (result.affected === 0) {
      throw new Error('Company not found');
    }
    throw new Error('Method not implemented.');
  }

  // =============================================
  // STORED PROCEDURE METHODS FOR DATA EXPORT
  // =============================================

  /**
   * Xuất tất cả dữ liệu công ty sử dụng stored procedure
   */
  async exportAllCompanies(): Promise<any[]> {
    try {
      const result = await this.dataSource.query('SELECT * FROM sp_get_companies()');
      return result;
    } catch (error : any) {
      throw new Error(`Error exporting companies: ${error.message}`);
    }
  }

  /**
   * Xuất dữ liệu công ty theo ID sử dụng stored procedure
   */
  async exportCompanyById(companyId: number): Promise<any> {
    try {
      const result = await this.dataSource.query('SELECT * FROM sp_get_company_by_id($1)', [companyId]);
      if (result.length === 0) {
        throw new Error('Company not found');
      }
      return result[0];
    } catch (error : any) {
      throw new Error(`Error exporting company by ID: ${error.message}`);
    }
  }

  /**
   * Xuất dữ liệu công ty có phân trang và tìm kiếm sử dụng stored procedure
   */
  async exportCompaniesWithPagination(
    page: number = 1,
    pageSize: number = 10,
    searchText?: string
  ): Promise<{ data: any[], totalCount: number }> {
    try {
      const result = await this.dataSource.query(
        'SELECT * FROM sp_get_companies_with_pagination($1, $2, $3)',
        [page, pageSize, searchText || null]
      );

      const totalCount = result.length > 0 ? result[0].total_count : 0;
      return {
        data: result,
        totalCount: totalCount
      };
    } catch (error : any) {
      throw new Error(`Error exporting companies with pagination: ${error.message}`);
    }
  }

  /**
   * Xuất dữ liệu công ty dưới dạng JSON sử dụng stored procedure
   */
  async exportCompaniesToJson(): Promise<any> {
    try {
      const result = await this.dataSource.query('SELECT sp_export_companies_to_json() as json_data');
      return result[0].json_data;
    } catch (error : any) {
      throw new Error(`Error exporting companies to JSON: ${error.message}`);
    }
  }

  /**
   * Xuất dữ liệu công ty dưới dạng CSV text sử dụng stored procedure
   */
  async exportCompaniesToCsv(): Promise<string> {
    try {
      const result = await this.dataSource.query('SELECT sp_export_companies_to_csv() as csv_data');
      return result[0].csv_data;
    } catch (error : any) {
      throw new Error(`Error exporting companies to CSV: ${error.message}`);
    }
  }


  async findAll(limit: number = 100, page: number = 1): Promise<Company []> {
    const sanitizedLimit = Math.max(1, Math.min(limit, 1000));
    const sanitizedPage = Math.max(1, page);
    return await this.companyRepository.find({
      where: { isDeleted: false },
      order: { createdAt: 'DESC' },
      skip: (sanitizedPage - 1) * sanitizedLimit,
      take: sanitizedLimit,
    });
  }


  async create(companyData: CreateCompanyDto): Promise<Company> {
    try {
      const companyToCreate = {
        ...companyData,
        isDeleted: false,
      };
      const company = this.companyRepository.create(companyToCreate);
      return await this.companyRepository.save(company);
    }
    catch {
      throw new Error('Error creating company');
    }

  }

  async update(id: number, companyData: CreateCompanyDto): Promise<Company> {
    try {
      const companyUpdate = {
        ...companyData,
        isDeleted: false,
      };
      await this.companyRepository.update(id, companyUpdate);
      const company = await this.companyRepository.findOne({ where: { id, isDeleted: false } });
      if (!company) {
        throw new Error('Company not found');
      }
      return company;
    }
    catch {
      throw new Error('Error creating company');
    }

  }
  async delete(id: number): Promise<void> {
    const result = await this.companyRepository.update(id, { isDeleted: true });
    if (result.affected === 0) {
      throw new Error('Company not found');
    }
    throw new Error('Method not implemented.');
  }
}