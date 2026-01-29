# 🛒 E-Commerce Backend API

Backend API đầy đủ cho hệ thống E-Commerce được xây dựng bằng **NestJS**, **TypeORM** và **MySQL**. Hệ thống hỗ trợ quản lý sản phẩm, đơn hàng, khách hàng và các tính năng authentication.

## 📋 Mục lục

- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt](#cài-đặt)
- [Cấu hình](#cấu-hình)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
  - [Authentication](#1-authentication)
  - [Banners](#2-banners)
  - [Categories](#3-categories)
  - [Products](#4-products)
  - [Product Reviews](#5-product-reviews)
  - [Favorites](#6-favorites)
  - [Product Images](#7-product-images)
  - [Product Colors](#8-product-colors)
  - [Attribute Definitions](#9-attribute-definitions)
  - [Customers](#10-customers)
  - [Customer Addresses](#11-customer-addresses)
  - [Orders](#12-orders)
  - [Order Items](#13-order-items)
  - [Upload](#14-upload)
  - [Admin](#15-admin)
- [Validation Rules](#validation-rules)
- [Error Handling](#error-handling)
- [Workflow Examples](#workflow-examples)
- [Testing](#testing)
- [Performance Optimization](#performance-optimization)
- [Security Considerations](#security-considerations)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Yêu cầu hệ thống

- **Node.js**: >= 18.x
- **npm**: >= 9.x
- **MySQL**: >= 8.0
- **TypeScript**: >= 5.7

---

## 🚀 Cài đặt

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd e-commerce-be
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

### Bước 3: Cấu hình database

1. Tạo database MySQL:

```sql
CREATE DATABASE `e-commerce` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

3. Cập nhật thông tin trong `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=e-commerce
```

### Bước 4: Chạy ứng dụng

```bash
# Development mode (với hot reload)
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

### Bước 5: Seed dữ liệu mẫu (tùy chọn)

```bash
npm run seed
```

Sau khi seed, bạn sẽ có:

- 5 Categories
- 8 Products
- 3 Banners
- ~24 Product Images
- ~20 Product Colors
- 8 Attribute Definitions
- 3 Customers (password: `password123`)

---

## ⚙️ Cấu hình

### Environment Variables

File `.env` cần có các biến sau:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=e-commerce

# Application
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# ImgBB API Configuration
IMGBB_API_KEY=your_imgbb_api_key_here
```

### Lưu ý bảo mật

- **KHÔNG** commit file `.env` vào git
- Thay đổi `JWT_SECRET` trong production
- Sử dụng strong password cho database
- Cấu hình firewall cho MySQL

---

## 📁 Cấu trúc dự án

```
e-commerce-be/
├── src/
│   ├── config/                    # Cấu hình database
│   │   └── database.config.ts
│   ├── database/                  # Database seeder
│   │   ├── seeder.service.ts
│   │   ├── seeder.module.ts
│   │   └── seed.ts
│   ├── entities/                  # TypeORM entities
│   │   ├── banner.entity.ts
│   │   ├── category.entity.ts
│   │   ├── product.entity.ts
│   │   ├── product-image.entity.ts
│   │   ├── product-color.entity.ts
│   │   ├── attribute-def.entity.ts
│   │   ├── customer.entity.ts
│   │   ├── customer-address.entity.ts
│   │   ├── order.entity.ts
│   │   ├── order-item.entity.ts
│   │   ├── product-review.entity.ts
│   │   └── favorite.entity.ts
│   ├── modules/                   # Feature modules
│   │   ├── auth/                  # Authentication
│   │   │   ├── dto/
│   │   │   ├── register.dto.ts
│   │   │   ├── login.dto.ts
│   │   │   └── auth-response.dto.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── strategies/
│   │   │   │   └── jwt.strategy.ts
│   │   │   └── guards/
│   │   │       └── jwt-auth.guard.ts
│   │   ├── banners/
│   │   ├── categories/
│   │   ├── products/
│   │   ├── product-images/
│   │   ├── product-colors/
│   │   ├── attribute-defs/
│   │   ├── customers/
│   │   ├── customer-addresses/
│   │   ├── orders/
│   │   ├── order-items/
│   │   ├── product-reviews/         # Product reviews & ratings
│   │   ├── favorites/               # Customer favorites/wishlist
│   │   └── upload/                  # Image upload với ImgBB
│   │       ├── dto/
│   │       │   └── upload-response.dto.ts
│   │       ├── upload.service.ts
│   │       ├── upload.controller.ts
│   │       └── upload.module.ts
│   ├── app.module.ts              # Root module
│   └── main.ts                    # Entry point
├── test/                          # E2E tests
├── .env.example                   # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🗄️ Database Schema

### Entity Relationships

```
customers (1) ──< (N) customer_addresses
customers (1) ──< (N) orders
customers (1) ──< (N) product_reviews
customers (1) ──< (N) favorites
categories (1) ──< (N) products
categories (1) ──< (N) attribute_defs
products (1) ──< (N) product_images
products (1) ──< (N) product_colors
products (1) ──< (N) product_reviews
products (1) ──< (N) order_items
products (1) ──< (N) favorites
orders (1) ──< (N) order_items
customer_addresses (1) ──< (N) orders
```

### Bảng chi tiết

#### 1. **banners**

| Field        | Type         | Description                     |
| ------------ | ------------ | ------------------------------- |
| id           | BIGINT       | Primary key                     |
| title        | VARCHAR(255) | Tiêu đề banner                  |
| content      | TEXT         | Nội dung banner                 |
| image_url    | TEXT         | URL hình ảnh                    |
| is_active    | BOOLEAN      | Trạng thái hoạt động            |
| display_type | VARCHAR(50)  | Loại hiển thị (carousel/banner) |
| created_at   | TIMESTAMP    | Ngày tạo                        |
| updated_at   | TIMESTAMP    | Ngày cập nhật                   |

#### 2. **categories**

| Field         | Type         | Description                     |
| ------------- | ------------ | ------------------------------- |
| id            | BIGINT       | Primary key                     |
| name          | VARCHAR(255) | Tên danh mục                    |
| thumbnail_url | TEXT         | URL thumbnail                   |
| configs       | TEXT         | Cấu hình danh mục (JSON string) |
| created_at    | TIMESTAMP    | Ngày tạo                        |
| updated_at    | TIMESTAMP    | Ngày cập nhật                   |

#### 3. **products**

| Field             | Type          | Description          |
| ----------------- | ------------- | -------------------- |
| id                | BIGINT        | Primary key          |
| name              | VARCHAR(255)  | Tên sản phẩm         |
| category_id       | BIGINT        | FK → categories.id   |
| short_description | TEXT          | Mô tả ngắn           |
| description       | TEXT          | Mô tả chi tiết       |
| price             | DECIMAL(12,2) | Giá sản phẩm         |
| stock             | INT           | Số lượng tồn kho     |
| main_image_url    | TEXT          | Hình ảnh chính       |
| extra_image_1-4   | TEXT          | Hình ảnh phụ         |
| is_active         | BOOLEAN       | Trạng thái hoạt động |
| created_at        | TIMESTAMP     | Ngày tạo             |
| updated_at        | TIMESTAMP     | Ngày cập nhật        |

#### 4. **product_reviews**

| Field       | Type      | Description          |
| ----------- | --------- | -------------------- |
| id          | BIGINT    | Primary key          |
| product_id  | BIGINT    | FK → products.id     |
| customer_id | BIGINT    | FK → customers.id    |
| rating      | INT       | Đánh giá từ 1-5 sao  |
| comment     | TEXT      | Bình luận (nullable) |
| created_at  | TIMESTAMP | Ngày tạo             |
| updated_at  | TIMESTAMP | Ngày cập nhật        |

**Unique Constraint:** `(product_id, customer_id)` - Mỗi khách hàng chỉ được review một lần cho mỗi sản phẩm.

#### 5. **favorites**

| Field       | Type      | Description       |
| ----------- | --------- | ----------------- |
| id          | BIGINT    | Primary key       |
| customer_id | BIGINT    | FK → customers.id |
| product_id  | BIGINT    | FK → products.id  |
| created_at  | TIMESTAMP | Ngày tạo (auto)   |

**Unique Constraint:** `(customer_id, product_id)` - Mỗi khách hàng chỉ có thể thêm một sản phẩm vào danh sách yêu thích một lần.

#### 6. **product_images**

| Field      | Type      | Description      |
| ---------- | --------- | ---------------- |
| id         | BIGINT    | Primary key      |
| product_id | BIGINT    | FK → products.id |
| url        | TEXT      | URL hình ảnh     |
| ordinal    | INT       | Thứ tự hiển thị  |
| is_primary | BOOLEAN   | Hình ảnh chính   |
| created_at | TIMESTAMP | Ngày tạo         |

#### 7. **product_colors**

| Field      | Type        | Description           |
| ---------- | ----------- | --------------------- |
| id         | BIGINT      | Primary key           |
| product_id | BIGINT      | FK → products.id      |
| color_name | VARCHAR(50) | Tên màu               |
| color_hex  | VARCHAR(7)  | Mã màu hex (nullable) |
| created_at | TIMESTAMP   | Ngày tạo              |

#### 8. **attribute_defs**

| Field       | Type         | Description                   |
| ----------- | ------------ | ----------------------------- |
| id          | BIGINT       | Primary key                   |
| name        | VARCHAR(150) | Tên thuộc tính                |
| category_id | BIGINT       | FK → categories.id (nullable) |
| value       | TEXT         | Giá trị thuộc tính (nullable) |
| created_at  | TIMESTAMP    | Ngày tạo                      |

#### 9. **customers**

| Field         | Type         | Description              |
| ------------- | ------------ | ------------------------ |
| id            | BIGINT       | Primary key              |
| email         | VARCHAR(255) | Email (unique)           |
| password_hash | VARCHAR(255) | Mật khẩu đã hash         |
| full_name     | VARCHAR(255) | Tên đầy đủ (nullable)    |
| is_active     | BOOLEAN      | Trạng thái hoạt động     |
| role          | ENUM         | Vai trò (CUSTOMER/ADMIN) |
| created_at    | TIMESTAMP    | Ngày tạo                 |
| updated_at    | TIMESTAMP    | Ngày cập nhật            |

#### 10. **customer_addresses**

| Field         | Type         | Description               |
| ------------- | ------------ | ------------------------- |
| id            | BIGINT       | Primary key               |
| customer_id   | BIGINT       | FK → customers.id         |
| receiver_name | VARCHAR(255) | Tên người nhận (nullable) |
| phone         | VARCHAR(50)  | Số điện thoại (nullable)  |
| address       | TEXT         | Địa chỉ                   |
| is_default    | BOOLEAN      | Địa chỉ mặc định          |
| created_at    | TIMESTAMP    | Ngày tạo                  |

#### 11. **orders**

| Field        | Type          | Description                                      |
| ------------ | ------------- | ------------------------------------------------ |
| id           | BIGINT        | Primary key                                      |
| order_no     | VARCHAR(50)   | Mã đơn hàng (unique)                             |
| customer_id  | BIGINT        | FK → customers.id (nullable)                     |
| address_id   | BIGINT        | FK → customer_addresses.id                       |
| status       | VARCHAR(50)   | Trạng thái (pending/shipped/completed/cancelled) |
| discount     | DECIMAL(12,2) | Giảm giá                                         |
| total_amount | DECIMAL(12,2) | Tổng tiền                                        |
| note         | TEXT          | Ghi chú                                          |
| created_at   | TIMESTAMP     | Ngày tạo                                         |
| updated_at   | TIMESTAMP     | Ngày cập nhật                                    |

#### 12. **order_items**

| Field      | Type          | Description                 |
| ---------- | ------------- | --------------------------- |
| id         | BIGINT        | Primary key                 |
| order_id   | BIGINT        | FK → orders.id              |
| product_id | BIGINT        | FK → products.id (nullable) |
| color_id   | VARCHAR(150)  | ID màu sắc (nullable)       |
| unit_price | DECIMAL(12,2) | Giá đơn vị                  |
| quantity   | INT           | Số lượng                    |
| created_at | TIMESTAMP     | Ngày tạo                    |

---

## 📚 API Documentation

Base URL: `http://localhost:3000`

Tất cả responses đều ở định dạng JSON.

---

### 1. Authentication

#### 1.1. Đăng ký

```http
POST /auth/register
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Nguyễn Văn A"
}
```

**Validation:**

- `email`: Required, valid email format, unique
- `password`: Required, min 6 characters
- `fullName`: Optional

**Success Response (201):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxNjE2ODQzODIyfQ...",
  "customer": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "Nguyễn Văn A"
  }
}
```

**Error Responses:**

- `409 Conflict`: Email already exists

```json
{
  "statusCode": 409,
  "message": "Email already exists",
  "error": "Conflict"
}
```

- `400 Bad Request`: Validation error

```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "fullName": "Nguyễn Văn A"
  }'
```

---

#### 1.2. Đăng nhập

```http
POST /auth/login
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "customer": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "Nguyễn Văn A"
  }
}
```

**Error Responses:**

- `401 Unauthorized`: Invalid credentials

```json
{
  "statusCode": 401,
  "message": "Invalid email or password",
  "error": "Unauthorized"
}
```

- `401 Unauthorized`: Account inactive

```json
{
  "statusCode": 401,
  "message": "Account is inactive",
  "error": "Unauthorized"
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

---

#### 1.3. Lấy thông tin profile

```http
GET /auth/profile
Authorization: Bearer <accessToken>
```

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**

```json
{
  "id": 1,
  "email": "user@example.com",
  "fullName": "Nguyễn Văn A"
}
```

**Error Responses:**

- `401 Unauthorized`: Invalid or missing token

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**cURL Example:**

```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 2. Banners

#### 2.1. Lấy tất cả banners

```http
GET /banners
```

**Success Response (200):**

```json
[
  {
    "id": 1,
    "title": "Khuyến mãi mùa hè",
    "content": "Giảm giá lên đến 50% cho tất cả sản phẩm điện tử",
    "imageUrl": "https://example.com/banner.jpg",
    "isActive": true,
    "displayType": "carousel",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

#### 2.2. Lấy banner theo ID

```http
GET /banners/:id
```

**Path Parameters:**

- `id` (number): ID của banner

**Success Response (200):**

```json
{
  "id": 1,
  "title": "Khuyến mãi mùa hè",
  "content": "Giảm giá lên đến 50%",
  "imageUrl": "https://example.com/banner.jpg",
  "isActive": true,
  "displayType": "carousel",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Response (404):**

```json
{
  "statusCode": 404,
  "message": "Banner with ID 999 not found",
  "error": "Not Found"
}
```

---

#### 2.3. Tạo banner mới

```http
POST /banners
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "Khuyến mãi mùa hè",
  "content": "Giảm giá lên đến 50%",
  "imageUrl": "https://example.com/banner.jpg",
  "isActive": true,
  "displayType": "carousel"
}
```

**Validation:**

- `title`: Required, string, max 255 characters
- `content`: Optional, string
- `imageUrl`: Required, string (URL)
- `isActive`: Optional, boolean (default: true)
- `displayType`: Optional, string (default: "carousel")

**Success Response (201):**

```json
{
  "id": 1,
  "title": "Khuyến mãi mùa hè",
  "content": "Giảm giá lên đến 50%",
  "imageUrl": "https://example.com/banner.jpg",
  "isActive": true,
  "displayType": "carousel",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

#### 2.4. Cập nhật banner

```http
PATCH /banners/:id
Content-Type: application/json
```

**Request Body:** (Tất cả fields đều optional)

```json
{
  "title": "Khuyến mãi mới",
  "isActive": false
}
```

**Success Response (200):** (Trả về banner đã cập nhật)

---

#### 2.5. Xóa banner

```http
DELETE /banners/:id
```

**Success Response (200):**

```json
{
  "message": "Banner deleted successfully"
}
```

---

### 3. Categories

#### 3.1. Lấy tất cả categories

```http
GET /categories
```

**Success Response (200):**

```json
[
  {
    "id": 1,
    "name": "Điện thoại",
    "thumbnailUrl": "https://example.com/thumbnail.jpg",
    "configs": "{\"displayOrder\": 1, \"showOnHomepage\": true}",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

#### 3.2. Lấy category theo ID

```http
GET /categories/:id
```

**Success Response (200):**

```json
{
  "id": 1,
  "name": "Điện thoại",
  "thumbnailUrl": "https://example.com/thumbnail.jpg",
  "configs": "{\"displayOrder\": 1, \"showOnHomepage\": true}",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

#### 3.3. Tạo category mới

```http
POST /categories
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Điện thoại",
  "thumbnailUrl": "https://example.com/thumbnail.jpg",
  "configs": "{\"displayOrder\": 1, \"showOnHomepage\": true, \"maxProducts\": 20}"
}
```

**Validation:**

- `name`: Required, string, max 255 characters
- `thumbnailUrl`: Optional, string (URL)
- `configs`: Optional, string (thường là JSON string để lưu cấu hình tùy chỉnh)

**Success Response (201):** (Trả về category đã tạo)

---

#### 3.4. Cập nhật category

```http
PATCH /categories/:id
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Smartphone",
  "thumbnailUrl": "https://example.com/new-thumbnail.jpg",
  "configs": "{\"displayOrder\": 2, \"showOnHomepage\": false}"
}
```

---

#### 3.5. Xóa category

```http
DELETE /categories/:id
```

**Lưu ý:** Khi xóa category, các products liên quan sẽ có `categoryId` = null (SET NULL).

---

### 4. Products

#### 4.1. Lấy tất cả products

```http
GET /products
```

**Success Response (200):**

```json
[
  {
    "id": 1,
    "name": "iPhone 15 Pro Max",
    "categoryId": 1,
    "category": {
      "id": 1,
      "name": "Điện thoại",
      "thumbnailUrl": "https://example.com/thumbnail.jpg"
    },
    "shortDescription": "iPhone mới nhất với chip A17 Pro",
    "description": "iPhone 15 Pro Max với màn hình 6.7 inch...",
    "price": "29990000.00",
    "stock": 50,
    "mainImageUrl": "https://example.com/image.jpg",
    "extraImage1": "https://example.com/image2.jpg",
    "extraImage2": "https://example.com/image3.jpg",
    "extraImage3": "https://example.com/image4.jpg",
    "extraImage4": "https://example.com/image5.jpg",
    "isActive": true,
    "reviews": [
      {
        "id": 1,
        "rating": 5,
        "comment": "Sản phẩm tuyệt vời!",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "customer": {
          "id": 1,
          "email": "customer@example.com",
          "fullName": "Nguyễn Văn A"
        }
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

#### 4.2. Lấy product theo ID

```http
GET /products/:id
```

**Success Response (200):**

```json
{
  "id": 1,
  "name": "iPhone 15 Pro Max",
  "categoryId": 1,
  "category": {
    "id": 1,
    "name": "Điện thoại"
  },
  "shortDescription": "iPhone mới nhất với chip A17 Pro",
  "description": "Chi tiết sản phẩm...",
  "price": "29990000.00",
  "stock": 50,
  "mainImageUrl": "https://example.com/image.jpg",
  "extraImage1": "https://example.com/image2.jpg",
  "extraImage2": "https://example.com/image3.jpg",
  "extraImage3": "https://example.com/image4.jpg",
  "extraImage4": "https://example.com/image5.jpg",
  "isActive": true,
  "productImages": [
    {
      "id": 1,
      "url": "https://example.com/image.jpg",
      "ordinal": 0,
      "isPrimary": true
    }
  ],
  "productColors": [
    {
      "id": 1,
      "colorName": "Đen",
      "colorHex": "#000000"
    }
  ],
  "reviews": [
    {
      "id": 1,
      "rating": 5,
      "comment": "Sản phẩm tuyệt vời!",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "customer": {
        "id": 1,
        "email": "customer@example.com",
        "fullName": "Nguyễn Văn A"
      }
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

#### 4.3. Tạo product mới

```http
POST /products
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "iPhone 15 Pro Max",
  "categoryId": 1,
  "shortDescription": "iPhone mới nhất với chip A17 Pro",
  "description": "iPhone 15 Pro Max với màn hình 6.7 inch, chip A17 Pro mạnh mẽ, camera 48MP và pin lâu dài.",
  "price": 29990000,
  "stock": 50,
  "mainImageUrl": "https://example.com/image.jpg",
  "extraImage1": "https://example.com/image2.jpg",
  "extraImage2": "https://example.com/image3.jpg",
  "extraImage3": "https://example.com/image4.jpg",
  "extraImage4": "https://example.com/image5.jpg",
  "isActive": true
}
```

**Validation:**

- `name`: Required, string, max 255 characters
- `categoryId`: Optional, number (must exist in categories table)
- `shortDescription`: Optional, string
- `description`: Optional, string
- `price`: Required, number, > 0
- `stock`: Optional, number, >= 0 (default: 0)
- `mainImageUrl`: Required, string (URL)
- `extraImage1-4`: Optional, string (URL)
- `isActive`: Optional, boolean (default: true)

**Success Response (201):** (Trả về product đã tạo)

---

#### 4.4. Cập nhật product

```http
PATCH /products/:id
Content-Type: application/json
```

**Request Body:** (Tất cả fields đều optional)

```json
{
  "name": "iPhone 15 Pro Max (Updated)",
  "price": 27990000,
  "stock": 30
}
```

---

#### 4.5. Xóa product

```http
DELETE /products/:id
```

**Lưu ý:** Khi xóa product, các order_items liên quan sẽ có `productId` = null (SET NULL).

---

### 5. Product Reviews

API quản lý đánh giá và bình luận sản phẩm. Mỗi khách hàng chỉ được đánh giá một lần cho mỗi sản phẩm.

#### 5.1. Tạo review mới

```http
POST /product-reviews
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**

```json
{
  "productId": 1,
  "rating": 5,
  "comment": "Sản phẩm rất tốt, đáng mua!"
}
```

**Validation:**

- `productId`: Required, number (must exist in products table)
- `rating`: Required, number, must be between 1-5
- `comment`: Optional, string

**Success Response (201):**

```json
{
  "id": 1,
  "productId": 1,
  "customerId": 1,
  "rating": 5,
  "comment": "Sản phẩm rất tốt, đáng mua!",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**

- `409 Conflict`: Customer đã review sản phẩm này rồi

```json
{
  "statusCode": 409,
  "message": "You have already reviewed this product. Each customer can only review a product once.",
  "error": "Conflict"
}
```

- `400 Bad Request`: Rating không hợp lệ

```json
{
  "statusCode": 400,
  "message": "Rating must be between 1 and 5 stars",
  "error": "Bad Request"
}
```

- `401 Unauthorized`: Chưa đăng nhập

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:3000/product-reviews \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "rating": 5,
    "comment": "Sản phẩm rất tốt!"
  }'
```

---

#### 5.2. Lấy tất cả reviews

```http
GET /product-reviews
```

**Query Parameters:**

- `productId` (optional): Filter reviews theo product ID

**Success Response (200):**

```json
[
  {
    "id": 1,
    "productId": 1,
    "customerId": 1,
    "rating": 5,
    "comment": "Sản phẩm rất tốt!",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "customer": {
      "id": 1,
      "email": "customer@example.com",
      "fullName": "Nguyễn Văn A"
    },
    "product": {
      "id": 1,
      "name": "iPhone 15 Pro Max"
    }
  }
]
```

**cURL Example:**

```bash
# Lấy tất cả reviews
curl -X GET http://localhost:3000/product-reviews

# Lấy reviews của một sản phẩm cụ thể
curl -X GET "http://localhost:3000/product-reviews?productId=1"
```

---

#### 5.3. Lấy reviews theo product ID

```http
GET /product-reviews/product/:productId
```

**Path Parameters:**

- `productId` (number): ID của sản phẩm

**Success Response (200):**

```json
[
  {
    "id": 1,
    "productId": 1,
    "customerId": 1,
    "rating": 5,
    "comment": "Sản phẩm rất tốt!",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "customer": {
      "id": 1,
      "email": "customer@example.com",
      "fullName": "Nguyễn Văn A"
    }
  }
]
```

**cURL Example:**

```bash
curl -X GET http://localhost:3000/product-reviews/product/1
```

---

#### 5.4. Lấy review theo ID

```http
GET /product-reviews/:id
```

**Path Parameters:**

- `id` (number): ID của review

**Success Response (200):**

```json
{
  "id": 1,
  "productId": 1,
  "customerId": 1,
  "rating": 5,
  "comment": "Sản phẩm rất tốt!",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "customer": {
    "id": 1,
    "email": "customer@example.com",
    "fullName": "Nguyễn Văn A"
  },
  "product": {
    "id": 1,
    "name": "iPhone 15 Pro Max"
  }
}
```

**Error Response (404):**

```json
{
  "statusCode": 404,
  "message": "Product review with ID 999 not found",
  "error": "Not Found"
}
```

---

#### 5.5. Cập nhật review

```http
PATCH /product-reviews/:id
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:** (Tất cả fields đều optional)

```json
{
  "rating": 4,
  "comment": "Sản phẩm tốt nhưng giá hơi cao"
}
```

**Validation:**

- `rating`: Optional, number, must be between 1-5 (nếu có)
- `comment`: Optional, string

**Success Response (200):** (Trả về review đã cập nhật)

**Error Responses:**

- `403 Forbidden`: Không phải owner của review

```json
{
  "statusCode": 403,
  "message": "You can only update your own reviews",
  "error": "Forbidden"
}
```

- `400 Bad Request`: Rating không hợp lệ

```json
{
  "statusCode": 400,
  "message": "Rating must be between 1 and 5 stars",
  "error": "Bad Request"
}
```

**cURL Example:**

```bash
curl -X PATCH http://localhost:3000/product-reviews/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 4,
    "comment": "Đã cập nhật đánh giá"
  }'
```

---

#### 5.6. Xóa review

```http
DELETE /product-reviews/:id
Authorization: Bearer <accessToken>
```

**Path Parameters:**

- `id` (number): ID của review

**Success Response (200):**

```json
{
  "message": "Review deleted successfully"
}
```

**Error Responses:**

- `403 Forbidden`: Không phải owner của review

```json
{
  "statusCode": 403,
  "message": "You can only delete your own reviews",
  "error": "Forbidden"
}
```

- `404 Not Found`: Review không tồn tại

**cURL Example:**

```bash
curl -X DELETE http://localhost:3000/product-reviews/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Lưu ý:**

- Chỉ có thể update/delete review của chính mình
- Mỗi khách hàng chỉ được review một lần cho mỗi sản phẩm (unique constraint)
- Rating phải từ 1-5 sao
- Reviews được sắp xếp theo thời gian tạo (mới nhất trước)

---

### 6. Favorites

API quản lý danh sách yêu thích sản phẩm của khách hàng. Mỗi khách hàng chỉ có thể thêm một sản phẩm vào danh sách yêu thích một lần.

#### 6.1. Thêm sản phẩm vào danh sách yêu thích

```http
POST /favorites
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**

```json
{
  "productId": 1
}
```

**Validation:**

- `productId`: Required, number (must exist in products table)

**Success Response (201):**

```json
{
  "id": 1,
  "customerId": 1,
  "productId": 1,
  "customer": {
    "id": 1,
    "email": "customer@example.com",
    "fullName": "Nguyễn Văn A"
  },
  "product": {
    "id": 1,
    "name": "iPhone 15 Pro Max",
    "price": "29990000.00"
  }
}
```

**Error Responses:**

- `400 Bad Request`: Sản phẩm đã có trong danh sách yêu thích

```json
{
  "statusCode": 400,
  "message": "Sản phẩm này đã có trong danh sách yêu thích",
  "error": "Bad Request"
}
```

- `401 Unauthorized`: Chưa đăng nhập

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:3000/favorites \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1
  }'
```

---

#### 6.2. Lấy danh sách yêu thích của khách hàng đang đăng nhập

```http
GET /favorites
Authorization: Bearer <accessToken>
```

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**

```json
[
  {
    "id": 1,
    "customerId": 1,
    "productId": 1,
    "product": {
      "id": 1,
      "name": "iPhone 15 Pro Max",
      "categoryId": 1,
      "shortDescription": "iPhone mới nhất với chip A17 Pro",
      "description": "iPhone 15 Pro Max với màn hình 6.7 inch...",
      "price": "29990000.00",
      "stock": 50,
      "mainImageUrl": "https://example.com/image.jpg",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  },
  {
    "id": 2,
    "customerId": 1,
    "productId": 2,
    "product": {
      "id": 2,
      "name": "Samsung Galaxy S24 Ultra",
      "price": "27990000.00",
      ...
    }
  }
]
```

**Lưu ý:**

- Endpoint này yêu cầu authentication (JWT token)
- Chỉ trả về danh sách yêu thích của khách hàng đang đăng nhập
- Sản phẩm được sắp xếp theo thời gian thêm vào (mới nhất trước)
- Response bao gồm đầy đủ thông tin sản phẩm

**Error Responses:**

- `401 Unauthorized`: Invalid or missing token

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

**cURL Example:**

```bash
curl -X GET http://localhost:3000/favorites \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

#### 6.3. Xóa sản phẩm khỏi danh sách yêu thích

```http
DELETE /favorites/:id
Authorization: Bearer <accessToken>
```

**Path Parameters:**

- `id` (number): ID của sản phẩm (productId) cần xóa khỏi danh sách yêu thích

**Success Response (200):**

```json
{
  "id": 1,
  "customerId": 1,
  "productId": 1
}
```

**Lưu ý:**

- Endpoint này yêu cầu authentication (JWT token)
- Chỉ có thể xóa sản phẩm khỏi danh sách yêu thích của chính mình
- Nếu sản phẩm không có trong danh sách yêu thích, endpoint sẽ trả về success mà không có lỗi

**Error Responses:**

- `401 Unauthorized`: Invalid or missing token

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

**cURL Example:**

```bash
curl -X DELETE http://localhost:3000/favorites/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Lưu ý tổng quát:**

- Tất cả endpoints đều yêu cầu authentication (JWT token)
- Mỗi khách hàng chỉ có thể thêm một sản phẩm vào danh sách yêu thích một lần (unique constraint)
- Chỉ có thể xem và quản lý danh sách yêu thích của chính mình
- Sản phẩm được sắp xếp theo thời gian thêm vào (mới nhất trước)

---

### 7. Product Images

#### 7.1. Lấy tất cả product images

```http
GET /product-images
```

**Success Response (200):**

```json
[
  {
    "id": 1,
    "productId": 1,
    "product": {
      "id": 1,
      "name": "iPhone 15 Pro Max"
    },
    "url": "https://example.com/image.jpg",
    "ordinal": 0,
    "isPrimary": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

#### 7.2. Lấy product image theo ID

```http
GET /product-images/:id
```

**Path Parameters:**

- `id` (number): ID của product image

**Success Response (200):**

```json
{
  "id": 1,
  "productId": 1,
  "product": {
    "id": 1,
    "name": "iPhone 15 Pro Max"
  },
  "url": "https://example.com/image.jpg",
  "ordinal": 0,
  "isPrimary": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Response (404):**

```json
{
  "statusCode": 404,
  "message": "Product image with ID 999 not found",
  "error": "Not Found"
}
```

---

#### 7.3. Tạo product image mới

```http
POST /product-images
Content-Type: application/json
```

**Request Body:**

```json
{
  "productId": 1,
  "url": "https://example.com/image.jpg",
  "ordinal": 0,
  "isPrimary": true
}
```

**Validation:**

- `productId`: Required, number (must exist in products table)
- `url`: Required, string (URL)
- `ordinal`: Optional, number (default: 0)
- `isPrimary`: Optional, boolean (default: false)

**Success Response (201):**

```json
{
  "id": 1,
  "productId": 1,
  "url": "https://example.com/image.jpg",
  "ordinal": 0,
  "isPrimary": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

#### 7.4. Cập nhật product image

```http
PATCH /product-images/:id
Content-Type: application/json
```

**Request Body:** (Tất cả fields đều optional)

```json
{
  "url": "https://example.com/new-image.jpg",
  "ordinal": 1,
  "isPrimary": false
}
```

**Success Response (200):** (Trả về product image đã cập nhật)

**Error Response (404):**

```json
{
  "statusCode": 404,
  "message": "Product image with ID 999 not found",
  "error": "Not Found"
}
```

---

#### 7.5. Xóa product image

```http
DELETE /product-images/:id
```

**Success Response (200):**

```json
{
  "message": "Product image deleted successfully"
}
```

**Error Response (404):**

```json
{
  "statusCode": 404,
  "message": "Product image with ID 999 not found",
  "error": "Not Found"
}
```

---

### 8. Product Colors

#### 8.1. Lấy tất cả product colors

```http
GET /product-colors
```

**Success Response (200):**

```json
[
  {
    "id": 1,
    "productId": 1,
    "product": {
      "id": 1,
      "name": "iPhone 15 Pro Max"
    },
    "colorName": "Đen",
    "colorHex": "#000000",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

#### 8.2. Lấy product color theo ID

```http
GET /product-colors/:id
```

**Path Parameters:**

- `id` (number): ID của product color

**Success Response (200):**

```json
{
  "id": 1,
  "productId": 1,
  "product": {
    "id": 1,
    "name": "iPhone 15 Pro Max"
  },
  "colorName": "Đen",
  "colorHex": "#000000",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Response (404):**

```json
{
  "statusCode": 404,
  "message": "Product color with ID 999 not found",
  "error": "Not Found"
}
```

---

#### 8.3. Tạo product color mới

```http
POST /product-colors
Content-Type: application/json
```

**Request Body:**

```json
{
  "productId": 1,
  "colorName": "Đen",
  "colorHex": "#000000"
}
```

**Validation:**

- `productId`: Required, number (must exist in products table)
- `colorName`: Required, string, max 50 characters
- `colorHex`: Optional, string, format: #RRGGBB (7 characters)

**Success Response (201):**

```json
{
  "id": 1,
  "productId": 1,
  "colorName": "Đen",
  "colorHex": "#000000",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

#### 8.4. Cập nhật product color

```http
PATCH /product-colors/:id
Content-Type: application/json
```

**Request Body:** (Tất cả fields đều optional)

```json
{
  "colorName": "Trắng",
  "colorHex": "#FFFFFF"
}
```

**Success Response (200):** (Trả về product color đã cập nhật)

**Error Response (404):**

```json
{
  "statusCode": 404,
  "message": "Product color with ID 999 not found",
  "error": "Not Found"
}
```

---

#### 8.5. Xóa product color

```http
DELETE /product-colors/:id
```

**Success Response (200):**

```json
{
  "message": "Product color deleted successfully"
}
```

**Error Response (404):**

```json
{
  "statusCode": 404,
  "message": "Product color with ID 999 not found",
  "error": "Not Found"
}
```

---

### 9. Attribute Definitions

#### 9.1. Lấy tất cả attribute definitions

```http
GET /attribute-defs
```

**Success Response (200):**

```json
[
  {
    "id": 1,
    "name": "RAM",
    "categoryId": 1,
    "category": {
      "id": 1,
      "name": "Điện thoại"
    },
    "value": "8GB, 12GB, 16GB",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

#### 9.2. Lấy attribute definition theo ID

```http
GET /attribute-defs/:id
```

**Path Parameters:**

- `id` (number): ID của attribute definition

**Success Response (200):**

```json
{
  "id": 1,
  "name": "RAM",
  "categoryId": 1,
  "category": {
    "id": 1,
    "name": "Điện thoại"
  },
  "value": "8GB, 12GB, 16GB",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Response (404):**

```json
{
  "statusCode": 404,
  "message": "Attribute definition with ID 999 not found",
  "error": "Not Found"
}
```

---

#### 9.3. Tạo attribute definition mới

```http
POST /attribute-defs
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "RAM",
  "categoryId": 1,
  "value": "8GB, 12GB, 16GB"
}
```

**Validation:**

- `name`: Required, string, max 150 characters
- `categoryId`: Optional, number (must exist in categories table)
- `value`: Optional, string

**Success Response (201):**

```json
{
  "id": 1,
  "name": "RAM",
  "categoryId": 1,
  "value": "8GB, 12GB, 16GB",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

#### 9.4. Cập nhật attribute definition

```http
PATCH /attribute-defs/:id
Content-Type: application/json
```

**Request Body:** (Tất cả fields đều optional)

```json
{
  "name": "Bộ nhớ RAM",
  "value": "8GB, 12GB, 16GB, 32GB"
}
```

**Success Response (200):** (Trả về attribute definition đã cập nhật)

**Error Response (404):**

```json
{
  "statusCode": 404,
  "message": "Attribute definition with ID 999 not found",
  "error": "Not Found"
}
```

---

#### 9.5. Xóa attribute definition

```http
DELETE /attribute-defs/:id
```

**Success Response (200):**

```json
{
  "message": "Attribute definition deleted successfully"
}
```

**Error Response (404):**

```json
{
  "statusCode": 404,
  "message": "Attribute definition with ID 999 not found",
  "error": "Not Found"
}
```

---

### 10. Customers

#### 10.1. Lấy tất cả customers

```http
GET /customers
```

**Success Response (200):**

```json
[
  {
    "id": 1,
    "email": "customer@example.com",
    "fullName": "Nguyễn Văn A",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Lưu ý:** Endpoint này không trả về `passwordHash` vì lý do bảo mật.

---

#### 10.2. Lấy customer theo ID

```http
GET /customers/:id
```

**Path Parameters:**

- `id` (number): ID của customer

**Success Response (200):**

```json
{
  "id": 1,
  "email": "customer@example.com",
  "fullName": "Nguyễn Văn A",
  "isActive": true,
  "role": "CUSTOMER",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Response (404):**

```json
{
  "statusCode": 404,
  "message": "Customer with ID 999 not found",
  "error": "Not Found"
}
```

---

#### 10.3. Tạo customer mới

```http
POST /customers
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "customer@example.com",
  "passwordHash": "$2b$10$hashedpassword...",
  "fullName": "Nguyễn Văn A",
  "isActive": true
}
```

**Validation:**

- `email`: Required, string, valid email format, unique
- `passwordHash`: Required, string (hashed password)
- `fullName`: Optional, string, max 255 characters
- `isActive`: Optional, boolean (default: true)
- `role`: Optional, enum (CUSTOMER/ADMIN, default: CUSTOMER)

**⚠️ Lưu ý:** Nên sử dụng `/auth/register` để tạo customer mới thay vì endpoint này, vì nó sẽ tự động hash password.

**Success Response (201):**

```json
{
  "id": 1,
  "email": "customer@example.com",
  "fullName": "Nguyễn Văn A",
  "isActive": true,
  "role": "CUSTOMER",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**

- `409 Conflict`: Email already exists

```json
{
  "statusCode": 409,
  "message": "Email already exists",
  "error": "Conflict"
}
```

---

#### 10.4. Cập nhật customer

```http
PATCH /customers/:id
Content-Type: application/json
```

**Request Body:** (Tất cả fields đều optional)

```json
{
  "fullName": "Nguyễn Văn B",
  "isActive": false
}
```

**Success Response (200):** (Trả về customer đã cập nhật)

**Error Response (404):**

```json
{
  "statusCode": 404,
  "message": "Customer with ID 999 not found",
  "error": "Not Found"
}
```

---

#### 10.5. Xóa customer

```http
DELETE /customers/:id
```

**Path Parameters:**

- `id` (number): ID của customer

**Success Response (200):**

```json
{
  "message": "Customer deleted successfully"
}
```

**Error Response (404):**

```json
{
  "statusCode": 404,
  "message": "Customer with ID 999 not found",
  "error": "Not Found"
}
```

**Lưu ý:** Khi xóa customer, các orders liên quan sẽ có `customerId` = null (SET NULL).

---

### 11. Customer Addresses

#### 11.1. Lấy tất cả customer addresses

```http
GET /customer-addresses
```

**Success Response (200):**

```json
[
  {
    "id": 1,
    "customerId": 1,
    "customer": {
      "id": 1,
      "email": "customer@example.com"
    },
    "receiverName": "Nguyễn Văn A",
    "phone": "0123456789",
    "address": "123 Đường ABC, Quận XYZ, TP.HCM",
    "isDefault": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

#### 11.2. Tạo customer address mới

```http
POST /customer-addresses
Content-Type: application/json
```

**Request Body:**

```json
{
  "customerId": 1,
  "receiverName": "Nguyễn Văn A",
  "phone": "0123456789",
  "address": "123 Đường ABC, Quận XYZ, TP.HCM",
  "isDefault": true
}
```

**Validation:**

- `customerId`: Required, number (must exist in customers table)
- `receiverName`: Optional, string, max 255 characters
- `phone`: Optional, string, max 50 characters
- `address`: Required, string
- `isDefault`: Optional, boolean (default: false)

---

#### 11.3. Lấy customer address theo ID

```http
GET /customer-addresses/:id
```

**Path Parameters:**

- `id` (number): ID của customer address

**Success Response (200):**

```json
{
  "id": 1,
  "customerId": 1,
  "customer": {
    "id": 1,
    "email": "customer@example.com"
  },
  "receiverName": "Nguyễn Văn A",
  "phone": "0123456789",
  "address": "123 Đường ABC, Quận XYZ, TP.HCM",
  "isDefault": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Response (404):**

```json
{
  "statusCode": 404,
  "message": "Customer address with ID 999 not found",
  "error": "Not Found"
}
```

---

#### 11.4. Lấy customer addresses theo customer ID

```http
GET /customer-addresses/customer/:customerId
```

**Path Parameters:**

- `customerId` (number): ID của customer

**Success Response (200):**

```json
[
  {
    "id": 1,
    "customerId": 1,
    "customer": {
      "id": 1,
      "email": "customer@example.com"
    },
    "receiverName": "Nguyễn Văn A",
    "phone": "0123456789",
    "address": "123 Đường ABC, Quận XYZ, TP.HCM",
    "isDefault": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "customerId": 1,
    "customer": {
      "id": 1,
      "email": "customer@example.com"
    },
    "receiverName": "Nguyễn Văn B",
    "phone": "0987654321",
    "address": "456 Đường XYZ, Quận ABC, TP.HCM",
    "isDefault": false,
    "createdAt": "2024-01-02T00:00:00.000Z"
  }
]
```

**cURL Example:**

```bash
curl -X GET http://localhost:3000/customer-addresses/customer/1
```

---

#### 11.5. Cập nhật customer address

```http
PATCH /customer-addresses/:id
Content-Type: application/json
```

**Request Body:** (Tất cả fields đều optional)

```json
{
  "receiverName": "Nguyễn Văn C",
  "phone": "0987654321",
  "address": "789 Đường MNO, Quận DEF, TP.HCM",
  "isDefault": false
}
```

**Success Response (200):** (Trả về customer address đã cập nhật)

**Error Response (404):**

```json
{
  "statusCode": 404,
  "message": "Customer address with ID 999 not found",
  "error": "Not Found"
}
```

---

#### 11.6. Xóa customer address

```http
DELETE /customer-addresses/:id
```

**Path Parameters:**

- `id` (number): ID của customer address

**Success Response (200):**

```json
{
  "message": "Customer address deleted successfully"
}
```

**Error Response (404):**

```json
{
  "statusCode": 404,
  "message": "Customer address with ID 999 not found",
  "error": "Not Found"
}
```

---

### 12. Orders

#### 12.1. Lấy tất cả orders

```http
GET /orders
```

**Success Response (200):**

```json
[
  {
    "id": 1,
    "orderNo": "ORD-2024-001",
    "customerId": 1,
    "customer": {
      "id": 1,
      "email": "customer@example.com",
      "fullName": "Nguyễn Văn A"
    },
    "addressId": 1,
    "address": {
      "id": 1,
      "address": "123 Đường ABC, Quận XYZ, TP.HCM",
      "receiverName": "Nguyễn Văn A",
      "phone": "0123456789"
    },
    "status": "pending",
    "discount": "0.00",
    "totalAmount": "29990000.00",
    "note": "Giao hàng nhanh",
    "orderItems": [
      {
        "id": 1,
        "productId": 1,
        "colorId": "1",
        "unitPrice": "29990000.00",
        "quantity": 1
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

#### 12.2. Lấy order theo ID

```http
GET /orders/:id
```

**Path Parameters:**

- `id` (number): ID của order

**Success Response (200):**

```json
{
  "id": 1,
  "orderNo": "ORD-2024-001",
  "customerId": 1,
  "customer": {
    "id": 1,
    "email": "customer@example.com",
    "fullName": "Nguyễn Văn A"
  },
  "addressId": 1,
  "address": {
    "id": 1,
    "address": "123 Đường ABC, Quận XYZ, TP.HCM",
    "receiverName": "Nguyễn Văn A",
    "phone": "0123456789"
  },
  "status": "pending",
  "discount": "0.00",
  "totalAmount": "29990000.00",
  "note": "Giao hàng nhanh",
  "orderItems": [
    {
      "id": 1,
      "productId": 1,
      "product": {
        "id": 1,
        "name": "iPhone 15 Pro Max",
        "price": "29990000.00"
      },
      "colorId": "1",
      "unitPrice": "29990000.00",
      "quantity": 1
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Response (404):**

```json
{
  "statusCode": 404,
  "message": "Order with ID 999 not found",
  "error": "Not Found"
}
```

---

#### 12.3. Lấy tất cả orders của khách hàng đang đăng nhập

```http
GET /orders/my-orders
Authorization: Bearer <accessToken>
```

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**

```json
[
  {
    "id": 1,
    "orderNo": "ORD-2024-001",
    "customerId": 1,
    "customer": {
      "id": 1,
      "email": "customer@example.com",
      "fullName": "Nguyễn Văn A"
    },
    "addressId": 1,
    "address": {
      "id": 1,
      "address": "123 Đường ABC, Quận XYZ, TP.HCM",
      "receiverName": "Nguyễn Văn A",
      "phone": "0123456789"
    },
    "status": "pending",
    "discount": "0.00",
    "totalAmount": "29990000.00",
    "note": "Giao hàng nhanh",
    "orderItems": [
      {
        "id": 1,
        "productId": 1,
        "product": {
          "id": 1,
          "name": "iPhone 15 Pro Max",
          "price": "29990000.00"
        },
        "colorId": "1",
        "unitPrice": "29990000.00",
        "quantity": 1
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Lưu ý:**

- Endpoint này yêu cầu authentication (JWT token)
- Chỉ trả về các đơn hàng của khách hàng đang đăng nhập
- Đơn hàng được sắp xếp theo thời gian tạo mới nhất (DESC)
- Bao gồm đầy đủ thông tin: customer, address, orderItems và orderItems.product

**Error Responses:**

- `401 Unauthorized`: Invalid or missing token

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**cURL Example:**

```bash
curl -X GET http://localhost:3000/orders/my-orders \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

#### 12.4. Tạo order mới

```http
POST /orders
Content-Type: application/json
```

**Request Body:**

```json
{
  "orderNo": "ORD-2024-001",
  "customerId": 1,
  "addressId": 1,
  "status": "pending",
  "discount": 0,
  "totalAmount": 29990000,
  "note": "Giao hàng nhanh"
}
```

**Validation:**

- `orderNo`: Required, string, max 50 characters, unique
- `customerId`: Optional, number (must exist in customers table)
- `addressId`: Required, number (must exist in customer_addresses table)
- `status`: Optional, string (default: "pending")
  - Valid values: `pending`, `shipped`, `completed`, `cancelled`
- `discount`: Optional, number, >= 0 (default: 0)
- `totalAmount`: Optional, number, >= 0 (default: 0)
- `note`: Optional, string

**Success Response (201):**

```json
{
  "id": 1,
  "orderNo": "ORD-2024-001",
  "customerId": 1,
  "addressId": 1,
  "status": "pending",
  "discount": "0.00",
  "totalAmount": "29990000.00",
  "note": "Giao hàng nhanh",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**

- `409 Conflict`: Order number already exists

```json
{
  "statusCode": 409,
  "message": "Order number already exists",
  "error": "Conflict"
}
```

- `400 Bad Request`: Invalid address ID

```json
{
  "statusCode": 400,
  "message": "Address with ID 999 not found",
  "error": "Bad Request"
}
```

---

#### 12.5. Cập nhật order

```http
PATCH /orders/:id
Content-Type: application/json
```

**Request Body:** (Tất cả fields đều optional)

```json
{
  "status": "shipped",
  "note": "Đã giao hàng"
}
```

**Success Response (200):** (Trả về order đã cập nhật)

**Error Response (404):**

```json
{
  "statusCode": 404,
  "message": "Order with ID 999 not found",
  "error": "Not Found"
}
```

**Workflow thông thường:**

1. `pending` → `shipped` → `completed`
2. `pending` → `cancelled`

---

#### 12.6. Xóa order

```http
DELETE /orders/:id
```

**Path Parameters:**

- `id` (number): ID của order

**Success Response (200):**

```json
{
  "message": "Order deleted successfully"
}
```

**Error Response (404):**

```json
{
  "statusCode": 404,
  "message": "Order with ID 999 not found",
  "error": "Not Found"
}
```

**Lưu ý:** Khi xóa order, các order_items liên quan sẽ bị xóa (CASCADE).

---

### 13. Order Items

#### 13.1. Lấy tất cả order items

```http
GET /order-items
```

**Success Response (200):**

```json
[
  {
    "id": 1,
    "orderId": 1,
    "order": {
      "id": 1,
      "orderNo": "ORD-2024-001"
    },
    "productId": 1,
    "product": {
      "id": 1,
      "name": "iPhone 15 Pro Max",
      "price": "29990000.00"
    },
    "colorId": "1",
    "unitPrice": "29990000.00",
    "quantity": 1,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

#### 13.2. Lấy order item theo ID

```http
GET /order-items/:id
```

**Path Parameters:**

- `id` (number): ID của order item

**Success Response (200):**

```json
{
  "id": 1,
  "orderId": 1,
  "order": {
    "id": 1,
    "orderNo": "ORD-2024-001"
  },
  "productId": 1,
  "product": {
    "id": 1,
    "name": "iPhone 15 Pro Max",
    "price": "29990000.00"
  },
  "colorId": "1",
  "unitPrice": "29990000.00",
  "quantity": 1,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Response (404):**

```json
{
  "statusCode": 404,
  "message": "Order item with ID 999 not found",
  "error": "Not Found"
}
```

---

#### 13.3. Tạo order item mới

```http
POST /order-items
Content-Type: application/json
```

**Request Body:**

```json
{
  "orderId": 1,
  "productId": 1,
  "colorId": "1",
  "unitPrice": 29990000,
  "quantity": 1
}
```

**Validation:**

- `orderId`: Required, number (must exist in orders table)
- `productId`: Required, number (must exist in products table)
- `colorId`: Optional, string, max 150 characters
- `unitPrice`: Required, number, > 0
- `quantity`: Optional, number, > 0 (default: 1)

**Success Response (201):**

```json
{
  "id": 1,
  "orderId": 1,
  "productId": 1,
  "colorId": "1",
  "unitPrice": "29990000.00",
  "quantity": 1,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**

- `400 Bad Request`: Order not found

```json
{
  "statusCode": 400,
  "message": "Order with ID 999 not found",
  "error": "Bad Request"
}
```

- `400 Bad Request`: Product not found

```json
{
  "statusCode": 400,
  "message": "Product with ID 999 not found",
  "error": "Bad Request"
}
```

**Lưu ý:** `unitPrice` nên lấy từ product.price tại thời điểm tạo order để tránh thay đổi giá sau này.

---

#### 13.4. Cập nhật order item

```http
PATCH /order-items/:id
Content-Type: application/json
```

**Request Body:** (Tất cả fields đều optional)

```json
{
  "quantity": 2,
  "unitPrice": 27990000
}
```

**Success Response (200):** (Trả về order item đã cập nhật)

**Error Response (404):**

```json
{
  "statusCode": 404,
  "message": "Order item with ID 999 not found",
  "error": "Not Found"
}
```

---

#### 13.5. Xóa order item

```http
DELETE /order-items/:id
```

**Path Parameters:**

- `id` (number): ID của order item

**Success Response (200):**

```json
{
  "message": "Order item deleted successfully"
}
```

**Error Response (404):**

```json
{
  "statusCode": 404,
  "message": "Order item with ID 999 not found",
  "error": "Not Found"
}
```

---

### 14. Upload

API upload ảnh sử dụng dịch vụ ImgBB để lưu trữ và quản lý hình ảnh.

#### 14.1. Upload một ảnh

```http
POST /upload/image
Content-Type: multipart/form-data
```

**Request:**

- Form data với key `image` (file)

**File Requirements:**

- **Allowed types:** JPEG, JPG, PNG, GIF, WebP
- **Max size:** 10MB
- **Field name:** `image`

**Success Response (200):**

```json
{
  "success": true,
  "status": 200,
  "data": {
    "id": "abc123",
    "title": "image.jpg",
    "url_viewer": "https://ibb.co/abc123",
    "url": "https://i.ibb.co/abc123/image.jpg",
    "display_url": "https://i.ibb.co/abc123/image.jpg",
    "width": 1920,
    "height": 1080,
    "size": 245678,
    "time": 1704067200,
    "expiration": 0,
    "image": {
      "filename": "image.jpg",
      "name": "image",
      "mime": "image/jpeg",
      "extension": "jpg",
      "url": "https://i.ibb.co/abc123/image.jpg"
    },
    "thumb": {
      "filename": "image.jpg",
      "name": "image",
      "mime": "image/jpeg",
      "extension": "jpg",
      "url": "https://i.ibb.co/abc123/image-thumb.jpg"
    },
    "medium": {
      "filename": "image.jpg",
      "name": "image",
      "mime": "image/jpeg",
      "extension": "jpg",
      "url": "https://i.ibb.co/abc123/image-medium.jpg"
    },
    "delete_url": "https://ibb.co/delete/abc123"
  }
}
```

**Error Responses:**

- `400 Bad Request`: No file provided

```json
{
  "statusCode": 400,
  "message": "No image file provided",
  "error": "Bad Request"
}
```

- `400 Bad Request`: Invalid file type

```json
{
  "statusCode": 400,
  "message": "Invalid file type. Allowed types: image/jpeg, image/jpg, image/png, image/gif, image/webp",
  "error": "Bad Request"
}
```

- `400 Bad Request`: File too large

```json
{
  "statusCode": 400,
  "message": "File size exceeds 10MB limit",
  "error": "Bad Request"
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:3000/upload/image \
  -F "image=@/path/to/image.jpg"
```

**JavaScript/Fetch Example:**

```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

const response = await fetch('http://localhost:3000/upload/image', {
  method: 'POST',
  body: formData,
});

const data = await response.json();
console.log('Image URL:', data.data.url);
```

---

#### 14.2. Upload nhiều ảnh

```http
POST /upload/images
Content-Type: multipart/form-data
```

**Request:**

- Form data với key `images` (multiple files)
- **Max files:** 10 files per request

**Success Response (200):**

```json
{
  "success": true,
  "images": [
    {
      "id": "abc123",
      "url": "https://i.ibb.co/abc123/image1.jpg",
      "display_url": "https://i.ibb.co/abc123/image1.jpg",
      ...
    },
    {
      "id": "def456",
      "url": "https://i.ibb.co/def456/image2.jpg",
      "display_url": "https://i.ibb.co/def456/image2.jpg",
      ...
    }
  ]
}
```

**Error Responses:**

- `400 Bad Request`: No files provided

```json
{
  "statusCode": 400,
  "message": "No image files provided",
  "error": "Bad Request"
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:3000/upload/images \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg" \
  -F "images=@/path/to/image3.jpg"
```

**JavaScript/Fetch Example:**

```javascript
const formData = new FormData();
fileInput.files.forEach((file) => {
  formData.append('images', file);
});

const response = await fetch('http://localhost:3000/upload/images', {
  method: 'POST',
  body: formData,
});

const data = await response.json();
data.images.forEach((img) => {
  console.log('Image URL:', img.url);
});
```

**Lưu ý:**

- Tất cả các file phải đáp ứng yêu cầu về type và size như upload một ảnh
- Nếu một file không hợp lệ, toàn bộ request sẽ bị từ chối
- URL trả về từ ImgBB có thể sử dụng trực tiếp trong các API khác (products, banners, categories, etc.)

**Cách lấy ImgBB API Key:**

1. Truy cập [https://imgbb.com/](https://imgbb.com/)
2. Đăng ký/Đăng nhập tài khoản
3. Vào phần **API** trong dashboard
4. Copy API key và thêm vào file `.env`:
   ```env
   IMGBB_API_KEY=your_api_key_here
   ```

---

## ✅ Validation Rules

### Common Validations

| Field Type | Rules                                            |
| ---------- | ------------------------------------------------ |
| Email      | Required, valid email format, unique             |
| Password   | Required, min 6 characters                       |
| String     | Max length varies by field                       |
| Number     | Must be valid number, >= 0 for prices/quantities |
| Boolean    | true/false                                       |
| URL        | Valid URL format                                 |
| Date       | ISO 8601 format                                  |

### Order Status Values

- `pending` - Đang chờ xử lý
- `shipped` - Đã giao hàng
- `completed` - Hoàn thành
- `cancelled` - Đã hủy

---

## ❌ Error Handling

### Standard Error Response Format

```json
{
  "statusCode": 400,
  "message": "Error message or array of validation errors",
  "error": "Error Type"
}
```

### Common HTTP Status Codes

| Code | Meaning               | Description                                     |
| ---- | --------------------- | ----------------------------------------------- |
| 200  | OK                    | Request successful                              |
| 201  | Created               | Resource created successfully                   |
| 400  | Bad Request           | Invalid request data                            |
| 401  | Unauthorized          | Missing or invalid authentication               |
| 404  | Not Found             | Resource not found                              |
| 409  | Conflict              | Resource already exists (e.g., duplicate email) |
| 500  | Internal Server Error | Server error                                    |

### Example Error Responses

**Validation Error (400):**

```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

**Not Found (404):**

```json
{
  "statusCode": 404,
  "message": "Product with ID 999 not found",
  "error": "Not Found"
}
```

**Conflict (409):**

```json
{
  "statusCode": 409,
  "message": "Email already exists",
  "error": "Conflict"
}
```

---

## 🔄 Workflow Examples

### Workflow 1: Tạo đơn hàng hoàn chỉnh

```bash
# 1. Đăng ký/Đăng nhập
POST /auth/register
# Response: { accessToken: "..." }

# 2. Tạo địa chỉ giao hàng
POST /customer-addresses
{
  "customerId": 1,
  "receiverName": "Nguyễn Văn A",
  "phone": "0123456789",
  "address": "123 Đường ABC",
  "isDefault": true
}
# Response: { id: 1, ... }

# 3. Tạo đơn hàng
POST /orders
{
  "orderNo": "ORD-2024-001",
  "customerId": 1,
  "addressId": 1,
  "status": "pending",
  "totalAmount": 29990000
}
# Response: { id: 1, ... }

# 4. Thêm sản phẩm vào đơn hàng
POST /order-items
{
  "orderId": 1,
  "productId": 1,
  "colorId": "1",
  "unitPrice": 29990000,
  "quantity": 1
}
# Response: { id: 1, ... }

# 5. Cập nhật trạng thái đơn hàng
PATCH /orders/1
{
  "status": "shipped"
}
```

### Workflow 2: Quản lý sản phẩm

```bash
# 1. Tạo category
POST /categories
{
  "name": "Điện thoại",
  "thumbnailUrl": "https://example.com/thumb.jpg"
}
# Response: { id: 1, ... }

# 2. Tạo product
POST /products
{
  "name": "iPhone 15 Pro Max",
  "categoryId": 1,
  "price": 29990000,
  "stock": 50,
  "mainImageUrl": "https://example.com/image.jpg"
}
# Response: { id: 1, ... }

# 3. Thêm hình ảnh sản phẩm
POST /product-images
{
  "productId": 1,
  "url": "https://example.com/image2.jpg",
  "ordinal": 1,
  "isPrimary": false
}

# 4. Thêm màu sắc sản phẩm
POST /product-colors
{
  "productId": 1,
  "colorName": "Đen",
  "colorHex": "#000000"
}
```

---

## 🚀 Deployment

### Production Checklist

- [ ] Thay đổi `JWT_SECRET` thành giá trị mạnh và ngẫu nhiên
- [ ] Đặt `NODE_ENV=production`
- [ ] Tắt `synchronize` trong database config (sử dụng migrations)
- [ ] Cấu hình CORS cho domain frontend
- [ ] Setup HTTPS/SSL
- [ ] Cấu hình rate limiting
- [ ] Setup logging và monitoring
- [ ] Backup database định kỳ
- [ ] Cấu hình firewall
- [ ] Sử dụng environment variables cho tất cả secrets

### Build và Deploy

```bash
# Build ứng dụng
npm run build

# Chạy production
npm run start:prod
```

### Environment Variables cho Production

```env
NODE_ENV=production
PORT=3000
DB_HOST=your-production-db-host
DB_PORT=3306
DB_USERNAME=your-db-username
DB_PASSWORD=your-strong-db-password
DB_DATABASE=e-commerce
JWT_SECRET=your-very-strong-random-secret-key
JWT_EXPIRES_IN=7d
```

---

## 🔧 Troubleshooting

### Lỗi kết nối database

**Lỗi:** `ER_ACCESS_DENIED_ERROR` hoặc `ECONNREFUSED`

**Giải pháp:**

1. Kiểm tra MySQL đang chạy: `mysql -u root -p`
2. Kiểm tra thông tin trong `.env` file
3. Kiểm tra firewall và network
4. Đảm bảo database `e-commerce` đã được tạo

### Lỗi JWT

**Lỗi:** `Unauthorized` khi gọi protected endpoints

**Giải pháp:**

1. Kiểm tra token có trong header: `Authorization: Bearer <token>`
2. Kiểm tra token chưa hết hạn
3. Kiểm tra `JWT_SECRET` trong `.env` khớp với khi tạo token

### Lỗi Foreign Key Constraint

**Lỗi:** `Cannot add or update a child row: a foreign key constraint fails`

**Giải pháp:**

1. Đảm bảo các bảng cha đã tồn tại (categories trước products)
2. Kiểm tra ID có tồn tại trong bảng cha
3. Kiểm tra kiểu dữ liệu khớp (BIGINT)

### Lỗi Port đã được sử dụng

**Lỗi:** `EADDRINUSE: address already in use :::3000`

**Giải pháp:**

```bash
# Tìm process đang dùng port 3000
lsof -ti:3000

# Kill process
kill -9 <PID>

# Hoặc đổi PORT trong .env
PORT=3001
```

### Lỗi TypeORM Synchronize

**Lỗi:** Schema không được tạo tự động

**Giải pháp:**

1. Kiểm tra `synchronize: true` trong development
2. Kiểm tra entities được import đúng trong `database.config.ts`
3. Xóa database và tạo lại nếu cần

---

## 📞 Support & Contact

Nếu gặp vấn đề hoặc có câu hỏi:

1. Kiểm tra [Troubleshooting](#troubleshooting) section
2. Xem logs trong console
3. Tạo issue trên repository

---

## 🧪 Testing

### Run E2E Tests

```bash
npm run test:e2e
```

### Run Unit Tests

```bash
npm run test
```

### Test Coverage

```bash
npm run test:cov
```

**Các file test chính:**

- `test/app.e2e-spec.ts` - E2E tests cho tất cả endpoints

---

## ⚡ Performance Optimization

### Caching Strategy

- Sử dụng HTTP caching headers
- Redis cache cho frequently accessed data
- Database query optimization với indexes

### Database Indexes

```sql
-- Products table
CREATE INDEX idx_category_id ON products(category_id);
CREATE INDEX idx_is_active ON products(is_active);
CREATE INDEX idx_created_at ON products(created_at);

-- Orders table
CREATE INDEX idx_customer_id ON orders(customer_id);
CREATE INDEX idx_status ON orders(status);
CREATE INDEX idx_created_at ON orders(created_at);

-- Reviews table
CREATE INDEX idx_product_id ON product_reviews(product_id);
CREATE INDEX idx_customer_id ON product_reviews(customer_id);
```

### Query Optimization

- Sử dụng `leftJoinAndSelect` để eager load relations
- Implement pagination cho list endpoints
- Batch operations khi có nhiều records

---

## 🔒 Security Considerations

### Authentication & Authorization

- ✅ JWT tokens cho authentication
- ✅ Password hashing với bcrypt
- ✅ Role-based access control (RBAC)

### Data Protection

- ✅ Input validation và sanitization
- ✅ SQL injection prevention (TypeORM ORM)
- ✅ CORS configuration
- ✅ Rate limiting (nên thêm)

### Best Practices

1. **HTTPS in Production** - Luôn sử dụng HTTPS
2. **Environment Variables** - Không commit sensitive data
3. **Regular Updates** - Update dependencies thường xuyên
4. **Security Headers** - Configure helmet middleware

```typescript
// Recommended: Add helmet for security headers
import helmet from '@nestjs/helmet';

app.use(helmet());
```

5. **Rate Limiting** - Ngăn chặn abuse

```typescript
// Recommended: Add rate limiting
import { ThrottlerModule } from '@nestjs/throttler';

ThrottlerModule.forRoot([
  {
    ttl: 60000,
    limit: 100,
  },
]);
```

---

## 📄 License

MIT License

---

## 🎯 Next Steps

Để phát triển frontend, bạn có thể:

1. ✅ Sử dụng các API endpoints đã document ở trên
2. ✅ Implement authentication flow với JWT tokens
3. ✅ Tạo UI cho quản lý sản phẩm, đơn hàng, khách hàng
4. ⏳ Thêm pagination cho list endpoints (nên optimize)
5. ⏳ Thêm filtering và sorting cho các list endpoints
6. ✅ File upload cho images đã được implement (sử dụng ImgBB)
7. ⏳ Thêm real-time notifications (Socket.io)
8. ⏳ Thêm email notifications
9. ⏳ Implement caching strategy
10. ⏳ Setup monitoring & logging

**Happy Coding! 🚀**
