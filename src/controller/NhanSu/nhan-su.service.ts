import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { scryptSync } from 'crypto';
import { NhanSu } from './nhan-su.entity';
import { CreateNhanSuDto, UpdateNhanSuDto } from './nhan-su.dto';
import { LogService } from '../../logs_hrm/log.service';

@Injectable()
export class NhanSuService {
    constructor(
        @InjectRepository(NhanSu)
        private nhanSuRepository: Repository<NhanSu>,
        private logService: LogService,
    ) { }

    async findAll(limit: number = 100, page: number = 1): Promise<NhanSu[]> {
        const sanitizedLimit = Math.max(1, Math.min(limit, 1000));
        const sanitizedPage = Math.max(1, page);
        return await this.nhanSuRepository.find({
            where: { isDeleted: false },
            order: { createdAt: 'DESC' },
            skip: (sanitizedPage - 1) * sanitizedLimit,
            take: sanitizedLimit,
        });
    }

    async findOne(id: number): Promise<NhanSu | null> {
        return await this.nhanSuRepository.findOne({
            where: { id, isDeleted: false },
        });
    }

    async findByEmail(email: string): Promise<NhanSu | null> {
        return await this.nhanSuRepository
            .createQueryBuilder('nhanSu')
            .addSelect('nhanSu.password')
            .where('nhanSu.email = :email', { email })
            .andWhere('nhanSu.isDeleted = false')
            .getOne();
    }

    private hashPassword(password: string): string {
        return scryptSync(password, 'hrm-node-secret', 64).toString('hex');
    }

    async create(nhanSuData: CreateNhanSuDto): Promise<NhanSu> {
        try {
            // Validate required fields
            if (!nhanSuData.hoTen || !nhanSuData.email) {
                const errorMsg = 'Họ tên và email là bắt buộc';
                await this.logService.create({
                    level: 'warn',
                    message: `NhanSu creation failed: ${errorMsg}`,
                    context: 'NhanSu',
                    metadata: { input: nhanSuData },
                });
                throw new Error(errorMsg);
            }

            // Check if email already exists
            const existingNhanSu = await this.nhanSuRepository.findOne({
                where: { email: nhanSuData.email, isDeleted: false },
            });

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

    async update(id: number, nhanSuData: UpdateNhanSuDto): Promise<NhanSu> {
        // Check if personnel exists
        const existingNhanSu = await this.findOne(id);
        if (!existingNhanSu) {
            throw new Error('NhanSu not found');
        }

        // Check email uniqueness if email is being updated
        if (nhanSuData.email && nhanSuData.email !== existingNhanSu.email) {
            const emailExists = await this.nhanSuRepository.findOne({
                where: { email: nhanSuData.email, isDeleted: false },
            });
            if (emailExists) {
                throw new Error('Email đã tồn tại trong hệ thống');
            }
        }

        // Validate email format if provided
        if (nhanSuData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(nhanSuData.email)) {
                throw new Error('Email không hợp lệ');
            }
        }

        // Validate phone number format if provided
        if (nhanSuData.soDienThoai) {
            const phoneRegex = /^[0-9+\-\s()]+$/;
            if (!phoneRegex.test(nhanSuData.soDienThoai)) {
                throw new Error('Số điện thoại không hợp lệ');
            }
        }

        // Validate password if provided
        if (nhanSuData.password) {
            if (nhanSuData.password.length < 8) {
                throw new Error('Mật khẩu phải có ít nhất 8 ký tự');
            }
            nhanSuData.password = this.hashPassword(nhanSuData.password);
        }

        // Validate salary if provided
        if (nhanSuData.luongCoBan !== undefined && nhanSuData.luongCoBan < 0) {
            throw new Error('Lương cơ bản không được âm');
        }

        // Handle department relation
        const updateData: any = { ...nhanSuData };
        if (nhanSuData.phongBan !== undefined) {
            updateData.phongBan = { id: nhanSuData.phongBan };
        }

        await this.nhanSuRepository.update(id, updateData);
        const updatedNhanSu = await this.findOne(id);
        if (!updatedNhanSu) {
            throw new Error('NhanSu not found');
        }
        return updatedNhanSu;
    }

    async remove(id: number): Promise<void> {
        const result = await this.nhanSuRepository.update(id, { isDeleted: true });
        if (result.affected === 0) {
            throw new Error('NhanSu not found');
        }
    }
}