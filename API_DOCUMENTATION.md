# DocVault API Documentation

This documentation describes the API endpoints for the DocVault backend service.

**Base URL**: `http://localhost:8000/api/v1`

## Authentication

The API uses JSON Web Tokens (JWT) for authentication.
- **Access Token**: Short-lived, passed via `accessToken` cookie or Authorization header.
- **Refresh Token**: Long-lived, passed via `refreshToken` cookie to obtain new access tokens.

Most endpoints require a valid Access Token found in the Cookies.

## Response Format

All API responses follow a standard structure:

**Success Response (HTTP 2xx):**
```json
{
  "statusCode": 200,
  "data": { ... },
  "message": "Success message",
  "success": true
}
```

**Error Response (HTTP 4xx/5xx):**
```json
{
  "statusCode": 400,
  "data": null,
  "message": "Error description",
  "success": false,
  "errors": []
}
```

---

## User Endpoints

Base path: `/users`

### Register User
Register a new user account.

- **URL**: `/register`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `fullname` (string, required)
  - `email` (string, required)
  - `username` (string, required)
  - `password` (string, required)
  - `role` (string, required)
  - `avatar` (file, required)
- **Success Response**: `201 Created` with user details (excluding password).

### Login User
Authenticate a user and receive access/refresh tokens.

- **URL**: `/login`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Body**:
  - `username` (string, required)
  - `password` (string, required)
- **Success Response**: `200 OK`
  - Sets `accessToken` and `refreshToken` cookies.
  - Returns user details and tokens in `data`.

### Logout User
Clear authentication cookies.

- **URL**: `/logout`
- **Method**: `POST`
- **Authentication**: Required
- **Success Response**: `200 OK`

### Refresh Access Token
Get a new access token using a valid refresh token.

- **URL**: `/refresh-token`
- **Method**: `POST`
- **Body**:
  - `refreshToken` (string, optional if cookie is present)
- **Success Response**: `200 OK` with new tokens.

### Get Current User
Get details of the currently logged-in user.

- **URL**: `/me`
- **Method**: `GET`
- **Authentication**: Required
- **Success Response**: `200 OK` with user details.

### Change Password
Update the user's password.

- **URL**: `/change-password`
- **Method**: `POST`
- **Authentication**: Required
- **Body**:
  - `oldPassword` (string, required)
  - `newPassword` (string, required)
- **Success Response**: `200 OK`

### Update Account Details
Update user profile information.

- **URL**: `/update-details`
- **Method**: `PUT`
- **Authentication**: Required
- **Body**:
  - `fullname` (string, required)
  - `email` (string, required)
- **Success Response**: `200 OK` with updated user details.

### Update Avatar
Update the user's profile picture.

- **URL**: `/update-avatar`
- **Method**: `PUT`
- **Authentication**: Required
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `avatar` (file, required)
- **Success Response**: `200 OK` with updated user details.

---

## Sender Endpoints

Base path: `/sender`

### Create Record
Upload a new file record.

- **URL**: `/create-record`
- **Method**: `POST`
- **Authentication**: Required
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `fileName` (string, required)
  - `description` (string, required)
  - `categoryTags` (string, required)
  - `file` (file, required)
- **Success Response**: `201 Created` with created record details.

### Get User Records
Get all records created by the authenticated user.

- **URL**: `/records`
- **Method**: `GET`
- **Authentication**: Required
- **Success Response**: `200 OK` with list of records.

---

## Receiver Endpoints

Base path: `/receiver`

### Get All Records
Get all records available in the system.

- **URL**: `/getAllRecords`
- **Method**: `GET`
- **Authentication**: Public
- **Success Response**: `200 OK` with list of all records including owner details.

---

## Record Endpoints

Base path: `/records`

### View Record
Get details of a specific record by ID.

- **URL**: `/view-record/:recordId`
- **Method**: `GET`
- **Authentication**: Public
- **Success Response**: `200 OK` with record details.

## Error Codes

- `400`: Bad Request (Missing fields, validation error)
- `401`: Unauthorized (Invalid token, expired token)
- `404`: Not Found (User or Record not found)
- `409`: Conflict (User already exists)
- `500`: Internal Server Error
