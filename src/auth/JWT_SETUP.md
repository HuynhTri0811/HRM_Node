# JWT Authentication Setup

JWT authentication has been successfully integrated into your HRM application.

## Files Created/Modified

### New Files:
- `jwt.strategy.ts` - Passport JWT strategy for validating tokens
- `jwt-auth.guard.ts` - Guard to protect routes with JWT authentication
- `current-user.decorator.ts` - Decorator to extract current user from JWT payload

### Modified Files:
- `auth.module.ts` - Added JwtModule and PassportModule configuration
- `auth.service.ts` - Updated to generate JWT tokens on login
- `auth.controller.ts` - Added profile endpoint with JWT protection
- `auth.dto.ts` - Added LoginResponseDto for response documentation

## Usage

### 1. Login Endpoint
```
POST /auth/login
Content-Type: application/json

{
  "email": "nguyenvana@example.com",
  "password": "P@ssw0rd123"
}
```

**Response:**
```json
{
  "message": "Đăng nhập thành công",
  "user": {
    "id": 1,
    "hoTen": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    ...
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

### 2. Using Protected Routes
To access JWT-protected endpoints, include the token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

Example:
```
GET /auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Protecting Your Controllers

To protect any controller endpoint with JWT authentication, use the `@UseGuards(JwtAuthGuard)` decorator:

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('your-route')
export class YourController {
  @Get('protected-endpoint')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async yourMethod(@CurrentUser() user: any) {
    // user contains { userId, email }
    return { message: 'You are authenticated', user };
  }
}
```

## Configuration

### JWT Secret Key
The JWT secret key can be configured via environment variable:

```bash
JWT_SECRET=your-secret-key-here
```

If not set, it defaults to: `hrm-node-jwt-secret-key`

**Important:** For production, always set a strong JWT_SECRET in your environment variables.

### JWT Token Expiration
Tokens expire after **1 hour** by default (3600 seconds).

To change this, modify the `expiresIn` option in `auth.module.ts`:

```typescript
JwtModule.registerAsync({
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET') || 'hrm-node-jwt-secret-key',
    signOptions: {
      expiresIn: '24h', // Change this value
    },
  }),
  inject: [ConfigService],
})
```

## Security Best Practices

1. **Never expose your JWT_SECRET** - Keep it in environment variables, not in code
2. **Use HTTPS** - Always transmit tokens over HTTPS in production
3. **Set appropriate token expiration** - Balance between security and user experience
4. **Implement token refresh** - Consider adding a refresh token mechanism for long sessions
5. **Validate token payload** - Always verify the user exists and is active

## Testing with Swagger

The JWT authentication is fully documented in Swagger. You can:

1. Go to `/api` (Swagger UI)
2. Click on the "Authorize" button
3. Enter your access token in the format: `Bearer <your_token>`
4. Protected endpoints will automatically include the Authorization header

## Troubleshooting

### Token Invalid or Expired
- Ensure you're sending the token in the correct format: `Bearer <token>`
- Check that the token hasn't expired (1 hour by default)
- Verify the JWT_SECRET matches the one used to sign the token

### 401 Unauthorized
- Make sure the `@UseGuards(JwtAuthGuard)` decorator is applied
- Verify the token is valid and not expired
- Check that the Authorization header is properly set

### Module Not Found
If you get a module not found error, ensure all JWT packages are installed:

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt @types/passport-jwt
```
