# DeBistro - Restaurant Management & QR-Based Ordering System

## 1. Header - Giới thiệu tổng quan

**DeBistro** là một hệ thống quản lý nhà hàng hiện đại, cho phép khách hàng quét mã QR tại bàn để gọi món thực thời, kèm theo hệ thống quản trị toàn diện cho nhân viên quán.

Với tính năng **Socket.IO realtime**, các đơn hàng mới sẽ được thông báo ngay lập tức đến bàn bếp, giúp tối ưu hóa quy trình phục vụ và tăng trải nghiệm khách hàng.

---

## 2. Key Features - Các tính năng cốt lõi

### 🍽️ Khách hàng (Guest)

- **Quét mã QR tại bàn**: Truy cập menu đồng bộ chỉ bằng một mã QR
- **Gọi món realtime**: Chọn món ăn, điều chỉnh số lượng, đặt hàng ngay lập tức
- **Theo dõi trạng thái đơn hàng**: Biết chính xác trạng thái (Pending → Processing → Delivered → Paid)
- **Quản lý đơn hàng**: Xem lịch sử đơn hàng, hủy/chỉnh sửa nếu cần

### 👨‍💼 Quản trị viên / Nhân viên (Admin/Staff)

- **Quản lý bàn ăn**: Thêm, sửa, xóa bàn; cập nhật sức chứa; tạo QR code riêng cho mỗi bàn
- **Quản lý menu**: Thêm/chỉnh sửa/xóa món ăn; cập nhật giá, hình ảnh, mô tả
- **Cập nhật trạng thái món**: Available → Unavailable → Hidden (linh hoạt theo thực tế)
- **Phân quyền nhân viên**: Tạo tài khoản nhân viên, phân quyền truy cập (Owner/Employee)

### 🔔 Realtime Notification (Socket.IO)

- **Thông báo đơn hàng mới**: Nhà bếp/Quầy tính tiền nhận thông báo ngay khi có đơn mới
- **Cập nhật trạng thái live**: Cả khách hàng và nhân viên thấy trạng thái đơn hàng cập nhật tức thì
- **Kết nối bàn-bếp**: Quản lý bàn, trạng thái đơn hàng được đồng bộ realtime

---

## 3. Tech Stack - Công nghệ sử dụng

### Frontend (Client)

- **Framework**: Next.js 16.1.6
- **Runtime**: React 19.2.3
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x, shadcn/ui
- **State Management**: TanStack React Query 5.90.21
- **Form & Validation**: React Hook Form, Zod
- **Authentication**: JWT (stored in cookies & localStorage)
- **Real-time**: Socket.IO client
- **Image**: Next.js Image Optimization

### Backend (Server)

- **Framework**: Fastify 5.8.2
- **Language**: TypeScript 5.x
- **Database**: SQLite (via Prisma)
- **ORM**: Prisma 7.5.0
- **Authentication**: @fastify/auth, fast-jwt
- **CORS**: @fastify/cors
- **File Upload**: @fastify/multipart
- **Validation**: Zod
- **Real-time**: Socket.IO 4.8.3
- **Password Hashing**: bcryptjs
- **Utilities**: date-fns, chalk

### Database

- **DBMS**: SQLite (dev) / Scalable to PostgreSQL
- **Migrations**: Prisma Migrate
- **Schema**: Zod + Prisma Schema Validation

---

## 4. Getting Started - Hướng dẫn cài đặt và chạy local

### Yêu cầu tiên quyết

- Node.js 18.x trở lên
- npm hoặc yarn
- Git

### 1. Clone Repository

```bash
git clone https://github.com/your-username/debistro2026.git
cd debistro2026
```

### 2. Cài đặt Dependencies

#### Server

```bash
cd server
npm install
```

#### Client

```bash
cd ../client
npm install
```

### 3. Cấu hình Environment Variables

#### Server (.env)

```bash
cd server
cp .env.example .env  # Nếu có
```

Cập nhật file `.env`:

```env
PORT=4000
DOMAIN=localhost
PROTOCOL=http
DATABASE_URL="file:./dev.db"
ACCESS_TOKEN_SECRET=your_secret_key
REFRESH_TOKEN_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRES_IN=10s
REFRESH_TOKEN_EXPIRES_IN=1d
INITIAL_EMAIL_OWNER=admin@order.com
INITIAL_PASSWORD_OWNER=123456
UPLOAD_FOLDER=uploads
```

#### Client (.env.local)

```bash
cd ../client
```

Tạo/Cập nhật `.env.local`:

```env
NEXT_PUBLIC_API_ENDPOINT=http://localhost:4000
NEXT_PUBLIC_URL=http://localhost:3000
```

### 4. Database Migration

```bash
cd server
npx prisma migrate dev
# Hoặc nếu chưa có migrations
npx prisma db push
npx prisma generate
```

### 5. Chạy Development Server

#### Terminal 1 - Server

```bash
cd server
npm run dev
# Server sẽ chạy ở http://localhost:4000
```

#### Terminal 2 - Client

```bash
cd client
npm run dev
# Client sẽ chạy ở http://localhost:3000
```

### 6. Truy cập ứng dụng

- **Admin/Staff Dashboard**: http://localhost:3000/login
  - Email: `admin@order.com`
  - Password: `123456`
- **Guest Menu** (via QR): http://localhost:3000/tables/[number]?token=[token]

---

## 5. Database Migration

### Khởi tạo Database lần đầu

```bash
cd server

# Nếu có migrations
npx prisma migrate dev --name init

# Hoặc đồng bộ schema trực tiếp
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

### Reset Database (mất dữ liệu)

```bash
npx prisma migrate reset
```

### Xem trạng thái migration

```bash
npx prisma migrate status
```

### Thêm model mới

1. Cập nhật `prisma/schema.prisma`
2. Chạy `npx prisma migrate dev --name <feature_name>`
3. Chạy `npx prisma generate`
4. Restart server

---

## 6. Architecture / Project Structure

```
debistro2026/
├── client/                          # Next.js Frontend
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── app/                     # App Router
│   │   │   ├── (public)/            # Public pages (home, login, guest menu)
│   │   │   ├── manage/              # Admin dashboard (protected)
│   │   │   ├── guest/               # Guest routes
│   │   │   └── api/                 # API routes (edge layer)
│   │   ├── components/              # Reusable UI components
│   │   ├── lib/                     # Utilities (http client, helpers)
│   │   ├── queries/                 # TanStack React Query hooks
│   │   ├── apiRequests/             # API call definitions
│   │   ├── schemaValidations/       # Zod schemas
│   │   ├── constants/               # Constants (types, roles, statuses)
│   │   └── types/                   # TypeScript types
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── server/                          # Fastify Backend
   ├── src/
   │   ├── index.ts                 # Server entry point
   │   ├── config.ts                # Environment & config validation
   │   ├── database/                # Prisma client
   │   ├── controllers/             # Business logic (login, orders, etc)
   │   ├── routes/                  # Fastify route definitions
   │   ├── plugins/                 # Custom Fastify plugins (socket, validator)
   │   ├── utils/                   # Helpers (JWT, crypto, errors)
   │   ├── schemaValidations/       # Zod schemas
   │   ├── hooks/                   # Fastify hooks (auth)
   │   ├── constants/               # Constants
   │   └── types/                   # TypeScript types
   ├── prisma/
   │   ├── schema.prisma            # Database schema
   │   ├── migrations/              # Migration history
   │   └── dbml/                    # Database diagram
   ├── prisma.config.ts             # Prisma 7 config
   ├── tsconfig.json
   └── package.json


```

### Client Folder Structure Chi Tiết

```
app/
├── (public)/                    # Public group layout
│   ├── layout.tsx
│   ├── page.tsx                 # Home page
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx         # Admin login
│   └── tables/
│       └── [number]/
│           ├── page.tsx         # Guest menu (QR-based)
│           └── guest-login-form.tsx
├── manage/                      # Protected admin routes
│   ├── layout.tsx
│   ├── dashboard/
│   ├── dishes/                  # Quản lý menu
│   ├── tables/                  # Quản lý bàn
│   ├── accounts/                # Quản lý nhân viên
│   └── orders/                  # Xem đơn hàng
└── guest/                       # Guest routes
    ├── menu/                    # Danh sách món ăn
    └── orders/                  # Lịch sử đơn hàng
```

### Server Folder Structure Chi Tiết

```
src/
├── controllers/
│   ├── auth.controller.ts       # Login, refresh token, logout
│   ├── account.controller.ts    # User management
│   ├── dish.controller.ts       # Menu management
│   ├── table.controller.ts      # Table management
│   ├── order.controller.ts      # Order processing
│   └── guest.controller.ts      # Guest auth & actions
├── routes/
│   ├── auth.route.ts            # /auth/*
│   ├── account.route.ts         # /accounts/*
│   ├── dish.route.ts            # /dishes/*
│   ├── table.route.ts           # /tables/*
│   ├── order.route.ts           # /orders/*
│   └── guest.route.ts           # /guest/*
├── plugins/
│   ├── socket.plugins.ts        # Socket.IO integration
│   └── validatorComplier.plugin.ts
├── utils/
│   ├── jwt.ts                   # Token signing/verification
│   ├── crypto.ts                # Password hashing
│   ├── duration.ts              # Duration parsing
│   ├── errors.ts                # Custom error classes
│   └── helpers.ts               # General utilities
└── database/
    └── index.ts                 # Prisma Client instance
```

---

## 7. Troubleshooting

### Database lỗi "table does not exist"

```bash
cd server
npx prisma db push
npx prisma generate
npm run dev
```

### CORS error trên localhost

- Kiểm tra `server/src/index.ts` - CORS config
- Kiểm tra `client/next.config.ts` - remotePatterns

### Token expiration issues

- Clear cookies và localStorage
- Đăng nhập lại để lấy token mới

### Socket.IO connection failed

- Đảm bảo server đang chạy ở port 4000
- Kiểm tra firewall/proxy settings

---


**Happy Ordering! 🍜**
