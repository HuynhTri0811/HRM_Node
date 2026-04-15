import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { scryptSync, timingSafeEqual } from 'crypto';
import { NhanSuService } from '../controller/NhanSu/nhan-su.service';
import { LogService } from '../logs_hrm/log.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly nhanSuService: NhanSuService,
    private readonly logService: LogService,
    private readonly jwtService: JwtService,
  ) {}

  private hashPassword(password: string): string {
    return scryptSync(password, 'hrm-node-secret', 64).toString('hex');
  }

  private validatePassword(password: string, hashedPassword: string): boolean {
    try {
      const suppliedHash = this.hashPassword(password);
      const suppliedBuffer = Buffer.from(suppliedHash, 'hex');
      const storedBuffer = Buffer.from(hashedPassword, 'hex');
      if (suppliedBuffer.length !== storedBuffer.length) {
        return false;
      }
      return timingSafeEqual(suppliedBuffer, storedBuffer);
    } catch {
      return false;
    }
  }

  async login(email: string, password: string) {
    const nhanSu = await this.nhanSuService.findByEmail(email);
    if (!nhanSu || !nhanSu.password || !this.validatePassword(password, nhanSu.password)) {
      await this.logService.create({
        level: 'warn',
        message: `Login failed for email: ${email}`,
        context: 'Auth',
        metadata: { email },
      });
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const { password: _password, ...userWithoutPassword } = nhanSu;

    const payload = { sub: nhanSu.id, email: nhanSu.email, role: nhanSu.role };
    const accessToken = this.jwtService.sign(payload);

    await this.logService.create({
      level: 'info',
      message: `Login success for email: ${email}`,
      context: 'Auth',
      metadata: { nhanSuId: nhanSu.id, email },
    });

    return {
      message: 'Đăng nhập thành công',
      user: userWithoutPassword,
      accessToken,
      expiresIn: 3600,
    };
  }
}
