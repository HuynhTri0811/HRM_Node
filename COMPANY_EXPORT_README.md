# Company Data Export với Stored Procedures

## Tổng quan

Hệ thống đã được bổ sung các stored procedure trong PostgreSQL để xuất dữ liệu Company một cách hiệu quả và linh hoạt.

## Stored Procedures đã tạo

### 1. `sp_get_companies()`
- **Mô tả**: Lấy tất cả dữ liệu công ty
- **Trả về**: Bảng với tất cả thông tin công ty
- **Endpoint**: `GET /company/export/all`

### 2. `sp_get_company_by_id(company_id INTEGER)`
- **Mô tả**: Lấy thông tin công ty theo ID
- **Tham số**: `company_id` - ID của công ty
- **Trả về**: Thông tin chi tiết của 1 công ty
- **Endpoint**: `GET /company/export/:id`

### 3. `sp_get_companies_with_pagination(page, page_size, search_text)`
- **Mô tả**: Lấy danh sách công ty có phân trang và tìm kiếm
- **Tham số**:
  - `page` - Số trang (mặc định: 1)
  - `page_size` - Số bản ghi mỗi trang (mặc định: 10)
  - `search_text` - Từ khóa tìm kiếm (tên hoặc mã công ty)
- **Trả về**: Dữ liệu phân trang với tổng số bản ghi
- **Endpoint**: `GET /company/export/paginated?page=1&pageSize=10&search=abc`

### 4. `sp_export_companies_to_json()`
- **Mô tả**: Xuất dữ liệu công ty dưới dạng JSON
- **Trả về**: JSON array chứa tất cả công ty
- **Endpoint**: `GET /company/export/json`

### 5. `sp_export_companies_to_csv()`
- **Mô tả**: Xuất dữ liệu công ty dưới dạng text CSV
- **Trả về**: Text có thể dùng để tạo file CSV
- **Endpoint**: `GET /company/export/csv`

## Cách sử dụng

### 1. Chạy Stored Procedures trong Database

```sql
-- Kết nối đến PostgreSQL database
psql -h localhost -U postgres -d hrm_db

-- Chạy file SQL chứa stored procedures
\i company_export_procedures.sql
```

### 2. Sử dụng API Endpoints

#### Lấy tất cả công ty:
```bash
GET /company/export/all
Authorization: Bearer <your-jwt-token>
```

#### Lấy công ty theo ID:
```bash
GET /company/export/1
Authorization: Bearer <your-jwt-token>
```

#### Lấy dữ liệu phân trang với tìm kiếm:
```bash
GET /company/export/paginated?page=1&pageSize=20&search=ABC
Authorization: Bearer <your-jwt-token>
```

#### Xuất dữ liệu JSON:
```bash
GET /company/export/json
Authorization: Bearer <your-jwt-token>
```

#### Xuất dữ liệu CSV:
```bash
GET /company/export/csv
Authorization: Bearer <your-jwt-token>
```

### 3. Response Examples

#### JSON Export Response:
```json
[
  {
    "id": 1,
    "code": "COMP001",
    "name": "Công ty ABC",
    "parentId": null,
    "address": "123 Đường Nguyễn Huệ",
    "phone": "+84-123-456-789",
    "email": "contact@abc.com",
    "website": "https://abc.com",
    "taxId": "TAX123456789",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

#### CSV Export Response:
```
ID,Mã công ty,Tên công ty,ID cha,Địa chỉ,Số điện thoại,Email,Website,Mã số thuế,Ngày tạo,Ngày cập nhật
1,"COMP001","Công ty ABC",,"123 Đường Nguyễn Huệ","+84-123-456-789","contact@abc.com","https://abc.com","TAX123456789","2024-01-15 10:30:00","2024-01-15 10:30:00"
```

## Lợi ích của việc sử dụng Stored Procedures

1. **Hiệu suất cao**: Stored procedures được biên dịch và lưu trong database
2. **Bảo mật**: Giảm nguy cơ SQL injection
3. **Tái sử dụng**: Có thể gọi từ nhiều nơi khác nhau
4. **Tối ưu hóa**: Database engine có thể tối ưu hóa execution plan
5. **Độ tin cậy**: Logic xử lý tập trung tại một nơi

## Lưu ý kỹ thuật

- Tất cả stored procedures đều loại trừ các bản ghi đã bị xóa mềm (`is_deleted = false`)
- Dữ liệu được sắp xếp theo thời gian tạo giảm dần (`created_at DESC`)
- Các trường nullable được xử lý đúng cách trong CSV export
- Validation và error handling được thực hiện ở tầng service và controller