# DocVault

**DocVault** is a secure, role-based document management system built to facilitate controlled file sharing and access between different user roles. It features a robust backend for handling file uploads/metadata and a modern frontend interface.

## 🌟 Key Features

-   **Role-Based Access Control (RBAC)**: Distinct permissions for **Senders** (upload/create) and **Receivers** (view/download).
-   **Secure Authentication**: Custom JWT implementation with Access & Refresh Token rotation logic.
-   **Cloud Storage**: Integrated with **Cloudinary** for secure, scalable file handling.
-   **Metadata Management**: Track document categories, descriptions, and ownership.
-   **Responsive UI**: Modern interface built with React.

## 🏗️ Technology Stack

### Frontend
-   **Framework**: React (v19)
-   **Build Tool**: Vite
-   **Language**: JavaScript (ES Modules)

### Backend
-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: MongoDB (with Mongoose)
-   **Storage**: Cloudinary SDK
-   **Auth**: JSON Web Tokens (JWT), bcrypt, cookie-parser

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
-   Node.js (v16+)
-   MongoDB Instance (Local or Atlas)
-   Cloudinary Account (for file uploads)

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables:
    Create a `.env` file in `backend/` with:
    ```env
    PORT=8000
    MONGODB_URI=your_mongodb_connection_string
    CORS_ORIGIN=http://localhost:5173 
    
    ACCESS_TOKEN_SECRET=your_secret
    ACCESS_TOKEN_EXPIRY=1d
    REFRESH_TOKEN_SECRET=your_refresh_secret
    REFRESH_TOKEN_EXPIRY=10d
    
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_key
    CLOUDINARY_API_SECRET=your_secret
    ```
4.  Start the server:
    ```bash
    npm run dev
    ```

### 2. Frontend Setup

1.  Open a new terminal and navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open the app in your browser (usually at `http://localhost:5173`).

## 📚 API Overview

The backend exposes RESTful endpoints at `http://localhost:8000/api/v1/`:

-   **Auth**: `/users/register`, `/users/login`, `/users/refresh-token`
-   **Sender Actions**: `/sender/create-record`, `/sender/records`
-   **Receiver Actions**: `/receiver/getAllRecords`
-   **Records**: `/records/view-record` (details)

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## 📄 License

This project is open-source and available under the ISC License.