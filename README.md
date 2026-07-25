# 📚 Readers Publication - Frontend Client

[![Next.js](https://img.shields.io/badge/Next.js-15.x-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?style=for-the-badge&logo=redux)](https://redux-toolkit.js.org/)

**Readers Publication** frontend is a modern, responsive, multi-language web application built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Redux Toolkit**. It provides an intuitive e-commerce & digital library experience for readers, complete with online PDF book viewing, localized content (English/Bengali), author profiles, package subscriptions, user management, and seamless backend API integration.

---

## 🚀 Features

- **🌐 Internationalization (i18n)**: Seamless multi-language support (Bengali & English) powered by `next-intl`.
- **📖 In-App PDF Reader**: Embedded PDF reader with `react-pdf` and `pdfjs-dist` for previewing and reading digital publications online.
- **🛒 E-Commerce Integration**: Interactive shopping cart, checkout, package subscriptions, and order tracking.
- **👤 User Profile & Auth**: User login, registration, password recovery, and Google OAuth 2.0 integration via `@react-oauth/google`.
- **✍️ Author & Book Showcase**: Detailed catalog for books, special packages, author details, and blog posts.
- **🎨 Modern UI/UX**: Built with Radix UI primitives, Lucide Icons, Framer Motion animations, Sonner toasts, and SweetAlert2 alerts.
- **📱 Fully Responsive**: Dynamic design optimized for mobile, tablet, and desktop views.
- **🐳 Dockerized**: Includes `Dockerfile` and `docker-compose.yml` for quick containerized deployment.

---

## 🛠️ Tech Stack

| Domain | Technology / Library |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript / JavaScript |
| **Styling** | Tailwind CSS, Radix UI Primitives, `clsx`, `tailwind-merge` |
| **State Management** | Redux Toolkit (`@reduxjs/toolkit`), `react-redux` |
| **Internationalization** | `next-intl` / `next-i18next` |
| **Forms & Validation** | React Hook Form, Zod validation |
| **API Client** | Axios |
| **PDF Viewer** | `react-pdf`, `pdfjs-dist` |
| **Authentication** | JWT Auth (via REST API) & Google OAuth (`@react-oauth/google`) |
| **Animations & UI** | Framer Motion, Embla Carousel, Lucide React Icons |

---

## 📁 Project Structure

```text
readers-publication-master/
├── app/                  # Next.js App Router (pages & internationalized routes)
│   └── [locale]/        # Localized routing (en, bn, etc.)
│       ├── authors/      # Author listing & detail pages
│       ├── profile/      # User profile pages
│       ├── special-package/ # Special book packages
│       └── ...          # Additional site routes
├── components/           # Reusable UI & Business components
│   └── ui/               # Radix UI / Shadcn base components
├── constants/            # Global constants & configurations
├── hooks/                # Custom React hooks
├── i18n/                 # i18n configuration & routing logic
├── lib/                  # Utility libraries & API client helpers
├── messages/             # Localization translation JSON files (en.json, bn.json)
├── store/                # Redux Toolkit slices & store setup
├── styles/               # Global CSS & Tailwind imports
├── utils/                # Helper functions & formatters
├── public/               # Static assets & public media
├── middleware.ts         # i18n & routing middleware
└── next.config.ts        # Next.js configuration
```

---

## ⚙️ Environment Variables

Create a `.env.local` or `.env` file in the root directory based on the sample configuration below:

```env
# Backend API Base URL
NEXT_PUBLIC_BACKEND_HOST=http://127.0.0.1:8000
BACKEND_URL=http://127.0.0.1:8000

# Google OAuth Client ID
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

---

## 💻 Getting Started

### Prerequisites

Ensure you have the following installed on your system:
- **Node.js**: `v18.x` or higher
- **npm** / **yarn** / **pnpm**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/readers-publication.git
   cd readers-publication/readers-publication-master
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp sample.env .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

---

## 🐳 Docker Setup

Run the application using Docker:

```bash
# Build & start the container
docker compose up -d --build
```

The application will be accessible at `http://localhost:3000`.

---

## 📜 Available Scripts

In the project directory, you can run:

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Builds the production-ready application bundle.
- `npm run start`: Starts the Next.js production server.
- `npm run lint`: Runs ESLint to check for code quality and errors.

---

## 📄 License

This project is proprietary and all rights are reserved by **Readers Publication**.
