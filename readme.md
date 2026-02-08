# DocVault

**DocVault** is a secure, role-based document management system for controlled file sharing and access. Senders upload and manage documents; receivers browse and view records. The app includes JWT auth with refresh tokens, Cloudinary storage, optional email-based password reset (Gmail SMTP), and a modern React frontend with dark mode and responsive dashboards.

---

## Project Summary

DocVault provides:

- **Two roles**: **Senders** create records (file + metadata), view their own list, and browse all records. **Receivers** view and search all records and open document details (including download).
- **Security**: Login with email or username; JWT access and refresh tokens in httpOnly cookies; role-based route protection; optional forgot-password flow with email (nodemailer + Gmail SMTP using `MAIL_ID` / `MAIL_PASSWORD`).
- **Storage**: Files are uploaded to **Cloudinary**; metadata (fileName, description, category, owner) is stored in **MongoDB**.
- **Frontend**: Landing page, auth (login, register, forgot password, reset password), and role-specific dashboards (sender: overview, my records, browse; receiver: all records). Document detail view with download link. Dark mode and a production-ready SPA server so reload on any route works.

---

## Key Features

| Feature | Description |
|--------|-------------|
| **Role-based access** | Sender: create records, my records (paginated), browse all. Receiver: view/search all records. |
| **Auth** | Register (with avatar), login (email or username), logout, refresh token, change password, **forgot password** (email reset link when SMTP configured). |
| **Records** | Upload file + metadata; list with pagination and filters; view record detail; download via stored file URL. |
| **Email** | Forgot-password reset link sent via **nodemailer** (Gmail SMTP) when `MAIL_ID` and `MAIL_PASSWORD` are set in backend `.env`. |
| **Cloud storage** | Cloudinary for file uploads; public URLs stored per record. |
| **UI** | React 19, Vite, Tailwind, dark mode, motion; SPA fallback server for production so deep links and reload work. |

---

## Technology Stack

### Frontend

- **React** 19, **Vite** 7, **Tailwind CSS** 4
- **React Router** 7, **Redux Toolkit** (auth state)
- **Axios** (API client, cookie credentials), **Motion** (animations), **Zod** (validation)
- **Theme**: CSS variables + `dark` class for dark mode

### Backend

- **Node.js**, **Express** 5
- **MongoDB** + **Mongoose**
- **JWT** (access + refresh), **bcrypt**, **cookie-parser** (signed cookies)
- **Cloudinary** (file uploads), **Multer** (multipart), **Zod** (validation)
- **Nodemailer** (SMTP for forgot-password emails; Gmail via `MAIL_ID` / `MAIL_PASSWORD`)

---

## Prerequisites

- **Node.js** 18+
- **MongoDB** (local or Atlas)
- **Cloudinary** account (for file storage)
- (Optional) **Gmail** with App Password for forgot-password emails

---

## Getting Started

### 1. Backend

```bash
cd backend
npm install
```

Create `backend/.env` (see **Environment variables** below). Then:

```bash
npm run dev
```

Backend runs at `http://localhost:8000`. API base: `http://localhost:8000/api/v1`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`. It proxies `/api` to the backend (see `frontend/vite.config.js`).

### 3. Production build (frontend)

```bash
cd frontend
npm run build
npm run start
```

`npm run start` runs `frontend/server.js`, which serves the `dist/` folder with **SPA fallback**: any path that does not match a static file returns `index.html`, so reload on routes like `/dashboard/my-records` works.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | No | `development` or `production` |
| `PORT` | No | Server port (default `8000`) |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `ACCESS_TOKEN_SECRET` | Yes | JWT access token secret |
| `REFRESH_TOKEN_SECRET` | Yes | JWT refresh token secret |
| `ACCESS_TOKEN_EXPIRY` | No | e.g. `15m` |
| `REFRESH_TOKEN_EXPIRY` | No | e.g. `7d` |
| `COOKIE_SECRET` | Yes | Secret for signing cookies |
| `CLOUD_NAME` | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |
| `CORS_ORIGIN` | No | Frontend origin (e.g. `http://localhost:5173`) |
| `FRONTEND_URL` | No | Frontend base URL for reset-password link (default `http://localhost:5173`) |
| `MAIL_ID` | No | Gmail address for sending reset emails |
| `MAIL_PASSWORD` | No | Gmail App Password (not account password) |
| `SMTP_HOST` | No | Default `smtp.gmail.com` |
| `SMTP_PORT` | No | Default `587` |
| `SMTP_SECURE` | No | Set `true` for port 465 |

If `MAIL_ID` and `MAIL_PASSWORD` are set, forgot-password sends the reset link by email. Otherwise, the API returns the reset URL in the response for dev/demo.

### Frontend

- `VITE_API_BASE_URL`: optional; if unset, requests go to same origin and the Vite proxy forwards `/api` to the backend.

---

## Project Structure

```
DocVault/
├── backend/
│   ├── config/          # Env validation, app config
│   ├── controllers/     # user, sender, receiver, record
│   ├── middleware/      # auth, role, validation, multer, error
│   ├── models/          # User, Record (Mongoose)
│   ├── routes/          # user, sender, receiver, record
│   ├── utils/           # ApiError, ApiResponse, asyncHandler, cloudinary, logger, mail (nodemailer)
│   ├── app.js           # Express app, routes, rate limit, health
│   └── index.js         # Server entry, DB connect
├── frontend/
│   ├── public/          # Static assets, logo
│   ├── src/
│   │   ├── api/         # Axios instance (baseURL, interceptors)
│   │   ├── components/  # Navbar, DashboardLayout, AuthLayout, etc.
│   │   ├── context/     # ThemeContext (dark mode)
│   │   ├── routes/      # Auth (Login, Register, ForgotPassword, ResetPassword), Dashboard, Landing
│   │   └── store/       # Redux (authSlice)
│   ├── server.js        # Production static server with SPA fallback
│   └── vite.config.js   # Proxy /api to backend
├── API_DOCUMENTATION.md # Full API reference
└── README.md
```

---

## API Overview

Base URL: `http://localhost:8000/api/v1`

| Area | Endpoints |
|------|-----------|
| **Users** | `POST /users/register`, `POST /users/login`, `POST /users/refresh-token`, `POST /users/forgot-password`, `POST /users/reset-password`, `POST /users/logout`, `GET /users/me`, `POST /users/change-password`, `PUT /users/update-details`, `PUT /users/update-avatar` |
| **Sender** | `POST /sender/create-record`, `GET /sender/records`, `GET /sender/browse` |
| **Receiver** | `GET /receiver/getAllRecords` |
| **Records** | `GET /records/view-record/:recordId` |

See **API_DOCUMENTATION.md** for request/response formats, auth, and errors.

---

## Contributing

Contributions are welcome. Open an issue or submit a pull request.

---

## License

ISC.
