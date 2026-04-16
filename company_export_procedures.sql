-- Stored Procedure để xuất dữ liệu Company
-- File: company_export_procedures.sql

-- =============================================
-- Stored Procedure: sp_get_companies
-- Mô tả: Lấy danh sách tất cả công ty
-- =============================================
CREATE OR REPLACE FUNCTION sp_get_companies()
RETURNS TABLE (
    id INTEGER,
    code_department VARCHAR(50),
    name_department VARCHAR(255),
    department_parent INTEGER,
    address VARCHAR(500),
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    tax_id VARCHAR(50),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    is_deleted BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id,
        c.id_code,
        c.name,
        c.department_parent,
        c.address,
        c.phone,
        c.email,
        c.website,
        c.tax_id,
        c.created_at,
        c.updated_at,
        c.is_deleted
    FROM company c
    WHERE c.is_deleted = false
    ORDER BY c.created_at DESC;
END;
$$;

-- =============================================
-- Stored Procedure: sp_get_company_by_id
-- Mô tả: Lấy thông tin công ty theo ID
-- =============================================
CREATE OR REPLACE FUNCTION sp_get_company_by_id(p_company_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    code_department VARCHAR(50),
    name_department VARCHAR(255),
    department_parent INTEGER,
    address VARCHAR(500),
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    tax_id VARCHAR(50),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    is_deleted BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id,
        c.id_code,
        c.name,
        c.department_parent,
        c.address,
        c.phone,
        c.email,
        c.website,
        c.tax_id,
        c.created_at,
        c.updated_at,
        c.is_deleted
    FROM company c
    WHERE c.id = p_company_id AND c.is_deleted = false;
END;
$$;

-- =============================================
-- Stored Procedure: sp_get_companies_with_pagination
-- Mô tả: Lấy danh sách công ty có phân trang
-- =============================================
CREATE OR REPLACE FUNCTION sp_get_companies_with_pagination(
    p_page INTEGER DEFAULT 1,
    p_page_size INTEGER DEFAULT 10,
    p_search_text VARCHAR(255) DEFAULT NULL
)
RETURNS TABLE (
    id INTEGER,
    code_department VARCHAR(50),
    name_department VARCHAR(255),
    department_parent INTEGER,
    address VARCHAR(500),
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    tax_id VARCHAR(50),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    is_deleted BOOLEAN,
    total_count BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_offset INTEGER;
    v_total_count BIGINT;
BEGIN
    -- Tính offset
    v_offset := (p_page - 1) * p_page_size;

    -- Đếm tổng số bản ghi
    SELECT COUNT(*)
    INTO v_total_count
    FROM company c
    WHERE c.is_deleted = false
    AND (p_search_text IS NULL OR
         LOWER(c.name) LIKE LOWER('%' || p_search_text || '%') OR
         LOWER(c.id_code) LIKE LOWER('%' || p_search_text || '%'));

    -- Trả về dữ liệu phân trang
    RETURN QUERY
    SELECT
        c.id,
        c.id_code,
        c.name,
        c.department_parent,
        c.address,
        c.phone,
        c.email,
        c.website,
        c.tax_id,
        c.created_at,
        c.updated_at,
        c.is_deleted,
        v_total_count
    FROM company c
    WHERE c.is_deleted = false
    AND (p_search_text IS NULL OR
         LOWER(c.name) LIKE LOWER('%' || p_search_text || '%') OR
         LOWER(c.id_code) LIKE LOWER('%' || p_search_text || '%'))
    ORDER BY c.created_at DESC
    LIMIT p_page_size
    OFFSET v_offset;
END;
$$;

-- =============================================
-- Stored Procedure: sp_export_companies_to_json
-- Mô tả: Xuất dữ liệu công ty dưới dạng JSON
-- =============================================
CREATE OR REPLACE FUNCTION sp_export_companies_to_json()
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    v_result JSON;
BEGIN
    SELECT json_agg(
        json_build_object(
            'id', c.id,
            'code', c.id_code,
            'name', c.name,
            'parentId', c.department_parent,
            'address', c.address,
            'phone', c.phone,
            'email', c.email,
            'website', c.website,
            'taxId', c.tax_id,
            'createdAt', c.created_at,
            'updatedAt', c.updated_at
        )
    )
    INTO v_result
    FROM company c
    WHERE c.is_deleted = false
    ORDER BY c.created_at DESC;

    RETURN v_result;
END;
$$;

-- =============================================
-- Stored Procedure: sp_export_companies_to_csv
-- Mô tả: Xuất dữ liệu công ty dưới dạng text (có thể dùng để tạo CSV)
-- =============================================
CREATE OR REPLACE FUNCTION sp_export_companies_to_csv()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    v_result TEXT := '';
    v_row RECORD;
BEGIN
    -- Header
    v_result := v_result || 'ID,Mã công ty,Tên công ty,ID cha,Địa chỉ,Số điện thoại,Email,Website,Mã số thuế,Ngày tạo,Ngày cập nhật' || E'\n';

    -- Data rows
    FOR v_row IN
        SELECT
            c.id,
            c.id_code,
            c.name,
            c.department_parent,
            c.address,
            c.phone,
            c.email,
            c.website,
            c.tax_id,
            c.created_at,
            c.updated_at
        FROM company c
        WHERE c.is_deleted = false
        ORDER BY c.created_at DESC
    LOOP
        v_result := v_result ||
            COALESCE(v_row.id::TEXT, '') || ',' ||
            COALESCE('"' || REPLACE(v_row.id_code, '"', '""') || '"', '') || ',' ||
            COALESCE('"' || REPLACE(v_row.name, '"', '""') || '"', '') || ',' ||
            COALESCE(v_row.department_parent::TEXT, '') || ',' ||
            COALESCE('"' || REPLACE(v_row.address, '"', '""') || '"', '') || ',' ||
            COALESCE('"' || REPLACE(v_row.phone, '"', '""') || '"', '') || ',' ||
            COALESCE('"' || REPLACE(v_row.email, '"', '""') || '"', '') || ',' ||
            COALESCE('"' || REPLACE(v_row.website, '"', '""') || '"', '') || ',' ||
            COALESCE('"' || REPLACE(v_row.tax_id, '"', '""') || '"', '') || ',' ||
            COALESCE(v_row.created_at::TEXT, '') || ',' ||
            COALESCE(v_row.updated_at::TEXT, '') || E'\n';
    END LOOP;

    RETURN v_result;
END;
$$;