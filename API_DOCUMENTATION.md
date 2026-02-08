# DocVault API Documentation

This documentation describes the API endpoints for the DocVault backend service.

**Base URL**: `http://localhost:8000/api/v1`

---

## Authentication

The API uses JSON Web Tokens (JWT) for authentication with httpOnly cookies.

- **Access Token**: Short-lived (default: 15m), stored in signed `accessToken` cookie.
- **Refresh Token**: Long-lived (default: 7d), stored in signed `refreshToken` cookie.

Most endpoints require a valid Access Token. The token is automatically read from:
1. Signed cookies (`req.signedCookies.accessToken`)
2. Regular cookies (`req.cookies.accessToken`)
3. Authorization header (`Bearer <token>`)

### Role-Based Access Control (RBAC)

Users have one of two roles:
- **sender**: Can create and manage their own records
- **receiver**: Can view all records in the system

Routes are protected by role. Attempting to access a route without the required role returns `403 Forbidden`.

**Password reset (forgot password):** The backend can send the reset link by email when `MAIL_ID` and `MAIL_PASSWORD` are set in the environment (Gmail SMTP by default). If not set, the reset URL is returned in the API response for dev/demo.

---

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
  "message": "Error description",
  "success": false,
  "errors": [
    { "field": "email", "message": "Invalid email address" }
  ]
}
```

---

## Health Check

### GET `/health`

Check the health status of the API and database connection.

- **Authentication**: None required
- **Rate Limiting**: Exempt

**Success Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2026-02-04T12:00:00.000Z",
  "uptime": 12345.67,
  "environment": "production",
  "version": "1.0.0",
  "database": {
    "status": "connected",
    "readyState": 1
  }
}
```

**Degraded Response (503):**
```json
{
  "status": "degraded",
  "database": { "status": "disconnected" }
}
```

---

## User Endpoints

Base path: `/users`

### POST `/register`

Register a new user account.

- **Content-Type**: `multipart/form-data`
- **Authentication**: None

**Request Body:**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `fullname` | string | Yes | 2-100 characters |
| `username` | string | Yes | 3-30 chars, alphanumeric + underscore only |
| `email` | string | Yes | Valid email format |
| `password` | string | Yes | Min 8 chars, must contain letter and number |
| `role` | string | Yes | Must be `sender` or `receiver` |
| `avatar` | file | Yes | Image file (jpeg, png, gif, webp) |

**Success Response**: `201 Created`
```json
{
  "statusCode": 201,
  "data": {
    "_id": "...",
    "fullname": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "sender",
    "avatar": "https://res.cloudinary.com/...",
    "createdAt": "...",
    "updatedAt": "..."
  },
  "message": "User registered successfully",
  "success": true
}
```

**Error Responses:**
- `400`: Validation error (missing fields, invalid format, weak password)
- `409`: User with email or username already exists

---

### POST `/login`

Authenticate a user and receive access/refresh tokens.

- **Content-Type**: `application/json`
- **Authentication**: None

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | string | Optional* | Email or username (backend looks up by both) |
| `email` | string | Optional* | Email or username (same as above) |
| `password` | string | Yes | User's password |

*Either `username` or `email` is required. The backend accepts a single credential field; frontend typically sends it as `username`.

**Success Response**: `200 OK`
- Sets `accessToken` and `refreshToken` as httpOnly signed cookies.

```json
{
  "statusCode": 200,
  "data": {
    "user": { ... },
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG..."
  },
  "message": "User successfully logined",
  "success": true
}
```

**Error Responses:**
- `400`: Missing credentials or incorrect password
- `404`: User not found

---

### POST `/logout`

Clear authentication cookies and invalidate refresh token.

- **Authentication**: Required

**Success Response**: `200 OK`
- Clears `accessToken` and `refreshToken` cookies.

---

### POST `/refresh-token`

Get a new access token using a valid refresh token.

- **Authentication**: Refresh token required (cookie or body)

**Request Body (optional if cookie present):**
```json
{
  "refreshToken": "eyJhbG..."
}
```

**Success Response**: `200 OK`
- Sets new `accessToken` and `refreshToken` cookies.

**Error Responses:**
- `401`: No refresh token, invalid token, or token expired/used

---

### POST `/forgot-password`

Request a password reset link. If `MAIL_ID` and `MAIL_PASSWORD` are set in the backend environment, the reset link is sent by email (Gmail SMTP). Otherwise, the link is returned in the response for dev/demo.

- **Content-Type**: `application/json`
- **Authentication**: None

**Request Body:**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `email` | string | Yes | Valid email address |

**Success Response**: `200 OK`

When email is configured (mail sent):
```json
{
  "statusCode": 200,
  "data": null,
  "message": "If an account with that email exists, a reset link has been sent.",
  "success": true
}
```

When email is not configured (dev/demo), response includes the reset URL:
```json
{
  "statusCode": 200,
  "data": {
    "resetToken": "hex-token",
    "resetUrl": "http://localhost:5173/reset-password/hex-token"
  },
  "message": "Password reset link generated successfully",
  "success": true
}
```

For security, the same generic message is returned whether the user exists or not when mail is configured.

---

### POST `/reset-password`

Set a new password using the token received by email or from the forgot-password response.

- **Content-Type**: `application/json`
- **Authentication**: None

**Request Body:**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `token` | string | Yes | Reset token (from email link or forgot-password response) |
| `newPassword` | string | Yes | Min 8 chars, at least one letter and one number |

**Success Response**: `200 OK`
```json
{
  "statusCode": 200,
  "data": null,
  "message": "Password has been reset successfully",
  "success": true
}
```

**Error Responses:**
- `400`: Invalid or expired password reset token

---

### GET `/me`

Get details of the currently logged-in user.

- **Authentication**: Required

**Success Response**: `200 OK`
```json
{
  "statusCode": 200,
  "data": {
    "_id": "...",
    "fullname": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "sender",
    "avatar": "https://..."
  },
  "message": "Current user fetched successfully",
  "success": true
}
```

---

### POST `/change-password`

Update the user's password.

- **Authentication**: Required

**Request Body:**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `oldPassword` | string | Yes | Current password |
| `newPassword` | string | Yes | Min 8 chars, letter + number, must differ from old |

**Success Response**: `200 OK`

**Error Responses:**
- `400`: Old password incorrect or validation failed

---

### PUT `/update-details`

Update user profile information.

- **Authentication**: Required

**Request Body:**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `fullname` | string | Yes | 2-100 characters |
| `email` | string | Yes | Valid email format |

**Success Response**: `200 OK` with updated user details.

---

### PUT `/update-avatar`

Update the user's profile picture.

- **Authentication**: Required
- **Content-Type**: `multipart/form-data`

**Request Body:**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `avatar` | file | Yes | Image file (jpeg, png, gif, webp), max 10MB |

**Success Response**: `200 OK` with updated user details.

---

## Sender Endpoints

Base path: `/sender`

**All sender endpoints require:**
- Authentication (valid access token)
- Role: `sender`

---

### POST `/create-record`

Upload a new file record.

- **Content-Type**: `multipart/form-data`

**Request Body:**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `fileName` | string | Yes | 1-255 characters |
| `description` | string | No | Max 1000 characters |
| `categoryTags` | string | Yes | One of: `Document`, `Images`, `Audio`, `PDF`, `Spreadsheet`, `PPT` |
| `file` | file | Yes | Max 10MB, allowed types: images, PDF, docs, spreadsheets, presentations, audio |

**Success Response**: `201 Created`
```json
{
  "statusCode": 201,
  "data": {
    "_id": "...",
    "fileName": "Report Q4",
    "description": "Quarterly financial report",
    "categoryTags": "PDF",
    "fileUploadUrl": "https://res.cloudinary.com/...",
    "owner": "...",
    "createdAt": "...",
    "updatedAt": "..."
  },
  "message": "Record created successfully",
  "success": true
}
```

**Error Responses:**
- `400`: Validation error or file missing
- `403`: User is not a sender
- `500`: File upload failed

---

### GET `/records`

Get all records created by the authenticated user (paginated).

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page (max 50) |
| `category` | string | - | Filter by categoryTags |

**Success Response**: `200 OK`
```json
{
  "statusCode": 200,
  "data": {
    "records": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  },
  "message": "User records fetched successfully",
  "success": true
}
```

---

### GET `/browse`

Get all records in the system for browsing (same shape as receiver's getAllRecords). Senders can use this to explore records with pagination, category filter, and search.

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page (max 50) |
| `category` | string | - | Filter by categoryTags |
| `search` | string | - | Search by fileName (case-insensitive) |

**Success Response**: `200 OK`
```json
{
  "statusCode": 200,
  "data": {
    "records": [
      {
        "_id": "...",
        "fileName": "Report Q4",
        "description": "...",
        "categoryTags": "PDF",
        "fileUploadUrl": "https://...",
        "owner": {
          "_id": "...",
          "fullname": "John Doe",
          "username": "johndoe",
          "avatar": "https://..."
        },
        "createdAt": "..."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  },
  "message": "Browse records fetched successfully",
  "success": true
}
```

---

## Receiver Endpoints

Base path: `/receiver`

**All receiver endpoints require:**
- Authentication (valid access token)
- Role: `receiver`

---

### GET `/getAllRecords`

Get all records in the system (paginated).

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page (max 50) |
| `category` | string | - | Filter by categoryTags |
| `search` | string | - | Search by fileName (case-insensitive) |

**Success Response**: `200 OK`
```json
{
  "statusCode": 200,
  "data": {
    "records": [
      {
        "_id": "...",
        "fileName": "Report Q4",
        "description": "...",
        "categoryTags": "PDF",
        "fileUploadUrl": "https://...",
        "owner": {
          "_id": "...",
          "fullname": "John Doe",
          "username": "johndoe",
          "avatar": "https://..."
        },
        "createdAt": "..."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  },
  "message": "All records fetched successfully",
  "success": true
}
```

---

## Record Endpoints

Base path: `/records`

---

### GET `/view-record/:recordId`

Get details of a specific record by ID.

- **Authentication**: Required
- **Roles**: Both `sender` and `receiver` allowed

**URL Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `recordId` | string | MongoDB ObjectId of the record |

**Success Response**: `200 OK`
```json
{
  "statusCode": 200,
  "data": {
    "_id": "...",
    "fileName": "Report Q4",
    "description": "...",
    "categoryTags": "PDF",
    "fileUploadUrl": "https://...",
    "owner": {
      "_id": "...",
      "fullname": "John Doe",
      "username": "johndoe",
      "avatar": "https://..."
    },
    "createdAt": "...",
    "updatedAt": "..."
  },
  "message": "Record fetched successfully",
  "success": true
}
```

**Error Responses:**
- `400`: Invalid record ID format
- `401`: Not authenticated
- `403`: Insufficient permissions
- `404`: Record not found

---

## Error Codes Reference

| Code | Meaning | Common Causes |
|------|---------|---------------|
| `400` | Bad Request | Missing fields, validation error, invalid file type |
| `401` | Unauthorized | Missing token, invalid token, expired token |
| `403` | Forbidden | Insufficient role permissions |
| `404` | Not Found | User or record doesn't exist |
| `409` | Conflict | Duplicate email/username |
| `413` | Payload Too Large | File exceeds 10MB limit |
| `429` | Too Many Requests | Rate limit exceeded (100 req/15min) |
| `500` | Internal Server Error | Server-side error |

---

## Rate Limiting

All API endpoints (except `/health`) are rate limited:

- **Window**: 15 minutes
- **Max Requests**: 100 per window (1000 in development)
- **Response on limit**: `429 Too Many Requests`

```json
{
  "success": false,
  "message": "Too many requests, please try again later."
}
```

---

## File Upload Limits

| Constraint | Value |
|------------|-------|
| Max file size | 10 MB |
| Allowed image types | jpeg, png, gif, webp |
| Allowed document types | pdf, doc, docx, xls, xlsx, ppt, pptx, txt, csv |
| Allowed audio types | mp3, wav, ogg |

---

## Cookie Configuration

All authentication cookies are configured with:

| Setting | Development | Production |
|---------|-------------|------------|
| `httpOnly` | true | true |
| `signed` | true | true |
| `secure` | false | true |
| `sameSite` | lax | strict |
| `maxAge` | 7 days | 7 days |
