# HRM API - Swagger Setup

## Installation

First, install the required Swagger package:

```bash
npm install @nestjs/swagger
```

## Usage

Once the package is installed, start your application:

```bash
npm run start:dev
```

## API Documentation

The Swagger documentation will be available at:
- **URL**: `http://localhost:3456/api`
- **UI**: Interactive Swagger UI for testing endpoints

## Available Endpoints

### Nhan Su (Personnel) Management

- `GET /nhan-su` - Get all personnel ✅ **IMPLEMENTED**
- `GET /nhan-su/:id` - Get personnel by ID ✅ **IMPLEMENTED**
- `POST /nhan-su` - Create new personnel ✅ **IMPLEMENTED**
- `PUT /nhan-su/:id` - Update personnel ✅ **IMPLEMENTED**
- `DELETE /nhan-su/:id` - Delete personnel ✅ **IMPLEMENTED**

## Features Implemented

- ✅ Complete CRUD operations for NhanSu entity
- ✅ Soft delete functionality (isDeleted flag)
- ✅ Comprehensive validation (required fields, email format, phone format, salary validation)
- ✅ Email uniqueness validation
- ✅ Proper error handling with Vietnamese error messages
- ✅ DTOs for request validation (CreateNhanSuDto, UpdateNhanSuDto)
- ✅ TypeORM integration
- ✅ Swagger documentation with detailed examples
- ⏳ Authentication/authorization can be added later

## Validation Rules

### Create Personnel (POST /nhan-su)
- **Required**: hoTen (name), email
- **Email**: Must be unique and valid format
- **Phone**: Optional, but must be valid format if provided
- **Salary**: Optional, but must be non-negative if provided
- **Status**: Defaults to 'active' if not provided

### Update Personnel (PUT /nhan-su/:id)
- **Email**: Must be unique (excluding current record) and valid format if provided
- **Phone**: Must be valid format if provided
- **Salary**: Must be non-negative if provided
- All other fields are optional

## Error Responses

- **400 Bad Request**: Validation errors (invalid format, negative salary, etc.)
- **404 Not Found**: Personnel not found
- **409 Conflict**: Email already exists

## Testing Examples

### Create Personnel (Success)
```bash
curl -X POST http://localhost:3456/nhan-su \
  -H "Content-Type: application/json" \
  -d '{
    "hoTen": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "soDienThoai": "0123456789",
    "luongCoBan": 15000000
  }'
```

### Create Personnel (Validation Error - Duplicate Email)
```bash
curl -X POST http://localhost:3456/nhan-su \
  -H "Content-Type: application/json" \
  -d '{
    "hoTen": "Nguyễn Văn B",
    "email": "nguyenvana@example.com"
  }'
# Response: 409 Conflict - "Email đã tồn tại trong hệ thống"
```

### Create Personnel (Validation Error - Invalid Email)
```bash
curl -X POST http://localhost:3456/nhan-su \
  -H "Content-Type: application/json" \
  -d '{
    "hoTen": "Nguyễn Văn C",
    "email": "invalid-email"
  }'
# Response: 400 Bad Request - "Email không hợp lệ"
```

## Entity Fields

The NhanSu entity includes:
- Basic info: id, hoTen (name), email
- Contact: soDienThoai (phone), diaChi (address)
- Employment: chucVu (position), phongBan (department), ngayVaoLam (hire date), ngayNghiViec (resignation date)
- Financial: luongCoBan (basic salary)
- Status: trangThai (status), isDeleted (soft delete flag)
- Timestamps: createdAt, updatedAt

## Testing the API

After starting the application, you can:

1. Visit `http://localhost:3456/api` for Swagger UI
2. Use the interactive documentation to test endpoints
3. Or use tools like Postman/cURL:

### Create Personnel (Success)
```bash
curl -X POST http://localhost:3456/nhan-su \
  -H "Content-Type: application/json" \
  -d '{
    "hoTen": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "soDienThoai": "0123456789",
    "luongCoBan": 15000000
  }'
```

### Create Personnel (Validation Error - Duplicate Email)
```bash
curl -X POST http://localhost:3456/nhan-su \
  -H "Content-Type: application/json" \
  -d '{
    "hoTen": "Nguyễn Văn B",
    "email": "nguyenvana@example.com"
  }'
# Response: 409 Conflict - "Email đã tồn tại trong hệ thống"
```

### Create Personnel (Validation Error - Invalid Email)
```bash
curl -X POST http://localhost:3456/nhan-su \
  -H "Content-Type: application/json" \
  -d '{
    "hoTen": "Nguyễn Văn C",
    "email": "invalid-email"
  }'
# Response: 400 Bad Request - "Email không hợp lệ"
```

### Get All Personnel
```bash
curl http://localhost:3456/nhan-su
```

### Get Specific Personnel
```bash
curl http://localhost:3456/nhan-su/1
```

### Update Personnel
```bash
curl -X PUT http://localhost:3456/nhan-su/1 \
  -H "Content-Type: application/json" \
  -d '{
    "chucVu": "Trưởng phòng",
    "luongCoBan": 20000000
  }'
```

### Delete Personnel (Soft Delete)
```bash
curl -X DELETE http://localhost:3456/nhan-su/1
```