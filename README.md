# 🎵 Swaralaya School of Music & Arts

[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Bundler-Vite%208-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![NestJS](https://img.shields.io/badge/Backend-NestJS%2010-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![TypeORM](https://img.shields.io/badge/ORM-TypeORM-FE5F50?logo=typeorm&logoColor=white)](https://typeorm.io/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Swaralaya** is a comprehensive full-stack web application designed for a premier Indian Classical & Contemporary Music & Arts School. The platform seamlessly connects aspiring music students, faculty, and administration by providing online course enrollments, event ticket bookings, interactive media galleries, blog publishing, integrated online payment gateways (Mollie), automated email notifications (Nodemailer), and a full-featured admin portal.

---

## 🚀 Key Features

### 🌐 Public Portal (Student & Visitor Experience)
- **Home & Brand Showcase**: Dynamic hero sections, interactive course previews, testimonials, and video showcases.
- **Courses & Programs**: Detailed pages for **Vocals** (Carnatic, Hindustani, Western Classical, Light Music) and **Instruments** (Guitar, Keyboard, Piano, Violin, Veena, Flute, Drums, Tabla, etc.).
- **Online Course Enrollment**: Interactive multi-step registration form with course selection, student details, and automatic payment link generation.
- **Events & Ticket Booking**: Upcoming concert and workshop listings, live ticket availability, custom tier pricing (Standard, VIP, etc.), and instant Mollie payment processing.
- **Media & Gallery**: Embedded video showcases, concert performances, student recitals, and audio/video highlights.
- **Blogs & Articles**: Interactive blog listing and detail pages with rich HTML rendering, categories, and social sharing options.
- **Benefits & About Us**: Insights into the school's heritage, certified music curriculum, expert faculty, and student growth opportunities.
- **Contact & Inquiry**: Integrated inquiry form with dynamic map links, direct WhatsApp float integration, and instant email dispatch.

### 🛡️ Admin Portal (`/admin`)
- **Dashboard Overview**: Key metrics including total enrollments, active event bookings, contact queries, and blog post statistics.
- **Enrollment Management**: Review, filter, approve, and track student course registrations and payment statuses.
- **Event & Ticket Management**: Create and update musical events, define ticket categories, set prices, capacity limits, and view booking manifests.
- **Booking Management**: Complete ticket sales history with customer details, payment confirmation status, and transaction references.
- **Blog Publishing Engine**: Full CRUD operations for blog articles with cover images, category tags, author metadata, and HTML content editing.
- **Contact Inquiries Desk**: Centralized view of user messages and consultation requests submitted through the portal.
- **SMTP & Email Configuration**: Dynamic SMTP configuration management for automated transaction emails and notification dispatches.

### ⚙️ Backend Architecture (NestJS & TypeORM)
- **JWT Authentication & Authorization**: Secure Admin authentication using Passport-JWT strategy and password hashing with `bcryptjs`.
- **Payment Processing Integration**: Mollie Payment API integration for handling course payments and ticket purchases.
- **Email Service**: Automated transaction emails (enrollment receipts, booking confirmations) via Nodemailer with customizable SMTP parameters.
- **File & Media Management**: Static uploads handler powered by Multer for event banners, blog thumbnails, and faculty assets.
- **Database Management**: MySQL database integration powered by TypeORM with auto-loading entities and dynamic synchronization.

---

## 🛠️ Tech Stack

| Domain | Tech / Library | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + React Router v7 | Modern single-page application architecture |
| **Build Tool** | Vite 8 | Ultra-fast development server & optimized production bundler |
| **Styling** | Custom Responsive CSS | Custom theme system with dark/light visual polish |
| **Security & Sanitization**| DOMPurify + Cheerio | Secure HTML rendering for blogs & dynamic text |
| **Backend Framework** | NestJS 10 (Node.js & TypeScript) | Enterprise-grade modular RESTful backend framework |
| **Database & ORM** | MySQL 8 + TypeORM | Relational database with typed entities & repositories |
| **Authentication** | Passport.js + JWT | Stateless bearer token authentication |
| **Payment Gateway** | Mollie API Client | Online payment processing for enrollments and events |
| **Mailer** | Nodemailer | Transactional email delivery service |

---

## 📁 Repository Structure

```
swaralaya/
├── swaralaya updated/
│   └── TaniskaProjectsqlChanged/
│       ├── src/                            # Frontend React Source Code
│       │   ├── components/                 # Reusable UI components (Navbar, Footer, Loader, etc.)
│       │   ├── pages/                      # Public pages (Home, Courses, Events, Blogs, Contact, etc.)
│       │   │   └── admin/                  # Admin portal views (Dashboard, Blogs, Bookings, SMTP)
│       │   ├── services/                   # Frontend API interaction services
│       │   ├── hooks/                      # Custom React Hooks
│       │   ├── data/                       # Static content & seed JSON data
│       │   ├── App.jsx                     # Route declarations & global layout wrapper
│       │   └── main.jsx                    # React application entry point
│       │
│       ├── swaralaya-backend/              # NestJS Backend API Service
│       │   ├── src/
│       │   │   ├── auth/                   # Admin authentication & JWT strategies
│       │   │   ├── blogs/                  # Blog posts API module
│       │   │   ├── bookings/               # Event ticket booking API module
│       │   │   ├── contacts/               # Contact forms & inquiry API module
│       │   │   ├── email/                  # Email sending service module
│       │   │   ├── enrollments/            # Course student enrollment API module
│       │   │   ├── events/                 # Events management API module
│       │   │   ├── mollie/                 # Mollie payment gateway integration
│       │   │   ├── settings/               # System settings module
│       │   │   ├── smtp-config/            # Dynamic SMTP settings module
│       │   │   └── ticket-types/           # Ticket pricing & tiers module
│       │   ├── database_exports/           # MySQL SQL schema dumps & exports
│       │   ├── package.json
│       │   └── tsconfig.json
│       │
│       ├── index.html                      # HTML Entry point
│       ├── package.json                    # Frontend dependencies & scripts
│       └── vite.config.js                  # Vite bundler configuration
└── README.md                               # Project documentation
```

---

## 🚦 Getting Started

### Prerequisites
Make sure you have the following installed on your local development machine:
- **Node.js** (`>= v18.x.x` recommended)
- **npm** or **yarn**
- **MySQL Server** (`>= 8.0`)

---

### 1. Database Setup

1. Start your local MySQL service (e.g., MySQL Workbench, XAMPP, or MariaDB).
2. Create a new database named `swaralaya_db`:
   ```sql
   CREATE DATABASE swaralaya_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. *(Optional)* Import existing sample SQL dumps located in:
   `swaralaya updated/TaniskaProjectsqlChanged/swaralaya-backend/database_exports/`

---

### 2. Backend Setup (NestJS)

1. Navigate to the backend directory:
   ```bash
   cd "swaralaya updated/TaniskaProjectsqlChanged/swaralaya-backend"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   Create a `.env` file inside `swaralaya-backend/` with the following configuration:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=your_mysql_password
   DB_DATABASE=swaralaya_db

   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRES_IN=7d

   MOLLIE_API_KEY=test_xxxxxxxxx

   FRONTEND_URL=http://localhost:5173
   ```
4. Start the backend server in development mode:
   ```bash
   npm run start:dev
   ```
   The backend API will run at `http://localhost:3000`.

---

### 3. Frontend Setup (React + Vite)

1. Open a new terminal window and navigate to the project directory:
   ```bash
   cd "swaralaya updated/TaniskaProjectsqlChanged"
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 🔑 Admin Access

- Access the Admin Login page by visiting `/admin` (e.g., `http://localhost:5173/admin`).
- Log in with your admin credentials to manage blogs, course enrollments, event ticket sales, contact messages, and email settings.

---

## 📜 Available NPM Scripts

### Frontend Scripts (`TaniskaProjectsqlChanged`)
- `npm run dev` - Launch Vite local development server.
- `npm run build` - Build production bundle to `dist/`.
- `npm run preview` - Preview production build locally.
- `npm run lint` - Run Oxlint code checker.

### Backend Scripts (`swaralaya-backend`)
- `npm run start:dev` - Run NestJS server in watch/live-reload mode.
- `npm run build` - Compile NestJS TypeScript application to JavaScript.
- `npm run start:prod` - Run production build server.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to fork the repository and submit a pull request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
