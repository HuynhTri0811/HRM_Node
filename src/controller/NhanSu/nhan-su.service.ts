import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NhanSu } from './nhan-su.entity';
import { CreateNhanSuDto, UpdateNhanSuDto } from './nhan-su.dto';
import { LogService } from '../../logs/log.service';

@Injectable()
export class NhanSuService {
    constructor(
        @InjectRepository(NhanSu)
        private nhanSuRepository: Repository<NhanSu>,
        private logService: LogService,
    ) { }

    async findAll(): Promise<NhanSu[]> {
        return await this.nhanSuRepository.find({
            where: { isDeleted: false },
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: number): Promise<NhanSu | null> {
        return await this.nhanSuRepository.findOne({
            where: { id, isDeleted: false },
        });
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

            // Set default values
            const nhanSuToCreate = {
                ...nhanSuData,
                trangThai: nhanSuData.trangThai || 'active',
                isDeleted: false,
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

        // Validate salary if provided
        if (nhanSuData.luongCoBan !== undefined && nhanSuData.luongCoBan < 0) {
            throw new Error('Lương cơ bản không được âm');
        }

        await this.nhanSuRepository.update(id, nhanSuData);
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