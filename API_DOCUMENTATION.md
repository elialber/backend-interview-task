# API Documentation

This document provides the documentation for the API routes and functionalities.

## Authentication

### POST /auth

This route is used for user authentication. It serves as a sign-in or register endpoint.

**Request Body:**

```json
{
  "username": "test@example.com",
  "password": "your-password"
}
```

**Success Response (200 OK):**

```json
{
  "token": "<jwt_token>"
}
```

**Error Response (400 Bad Request):**

```json
{
  "message": "Username and password are required"
}
```

**Error Response (401 Unauthorized):**

```json
{
  "message": "Authentication failed"
}
```

## Me

### GET /me

This route returns the details of the authenticated user.

**Headers:**

- `Authorization`: `Bearer <jwt_token>`

**Success Response (200 OK):**

```json
{
  "sub": "<user_id>",
  "cognito:groups": [
    "user"
  ],
  "email_verified": true,
  "iss": "https://cognito-idp.sa-east-1.amazonaws.com/sa-east-1_flr8GZaH0",
  "cognito:username": "test@example.com",
  "origin_jti": "...",
  "aud": "6vus2v45rs9hjenib42rbj7ncc",
  "event_id": "...",
  "token_use": "id",
  "auth_time": 1678886400,
  "exp": 1678890000,
  "iat": 1678886400,
  "jti": "...",
  "email": "test@example.com"
}
```

**Error Response (401 Unauthorized):**

```json
{
  "message": "Authentication token is missing"
}
```

```json
{
  "message": "Invalid token"
}
```

## Edit Account

### PUT /edit-account

This route allows a user to edit their own account information. Admins can edit any user's information.

**Headers:**

- `Authorization`: `Bearer <jwt_token>`

**Request Body (User):**

```json
{
  "name": "New User Name"
}
```

**Request Body (Admin):**

```json
{
  "name": "New User Name",
  "role": "admin"
}
```

**Success Response (200 OK):**

```json
{
  "id": "<user_id>",
  "name": "New User Name",
  "email": "test@example.com",
  "role": "user",
  "isOnboarded": true,
  "createdAt": "...",
  "updatedAt": "...",
  "deletedAt": null
}
```

**Error Response (403 Forbidden):**

```json
{
  "message": "Only admins can change the role"
}
```

**Error Response (404 Not Found):**

```json
{
  "message": "User not found"
}
```

## Users

### GET /users

This route returns a list of all users. This route is only accessible to admins.

**Headers:**

- `Authorization`: `Bearer <jwt_token>`

**Success Response (200 OK):**

```json
[
  {
    "id": "<user_id>",
    "name": "User 1",
    "email": "user1@example.com",
    "role": "user",
    "isOnboarded": true,
    "createdAt": "...",
    "updatedAt": "...",
    "deletedAt": null
  },
  {
    "id": "<user_id>",
    "name": "User 2",
    "email": "user2@example.com",
    "role": "admin",
    "isOnboarded": false,
    "createdAt": "...",
    "updatedAt": "...",
    "deletedAt": null
  }
]
```

**Error Response (403 Forbidden):**

```json
{
  "message": "Only admins can access this route"
}
```

## cURL Examples

### POST /auth

```bash
curl -X POST 'http://localhost:3001/auth' \
-H 'Content-Type: application/json' \
-d \
'{
  "username": "test@example.com",
  "password": "your-password"
}'
```

### GET /me

```bash
curl -X GET 'http://localhost:3001/me' \
-H 'Authorization: Bearer <jwt_token>'
```

### PUT /edit-account (as User)

```bash
curl -X PUT 'http://localhost:3001/edit-account' \
-H 'Authorization: Bearer <jwt_token>' \
-H 'Content-Type: application/json' \
-d \
'{
  "name": "New User Name"
}'
```

### PUT /edit-account (as Admin)

```bash
curl -X PUT 'http://localhost:3001/edit-account' \
-H 'Authorization: Bearer <jwt_token>' \
-H 'Content-Type: application/json' \
-d \
'{
  "name": "New User Name",
  "role": "admin"
}'
```

### GET /users (as Admin)

```bash
curl -X GET 'http://localhost:3001/users' \
-H 'Authorization: Bearer <jwt_token>'
```
