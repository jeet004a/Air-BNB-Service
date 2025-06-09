# AirBnB User Service Backend

This project is the **User Service** for an AirBnB-like platform. It provides RESTful APIs for user authentication, registration, and profile management. The backend is built using Node.js, Express, Drizzle ORM (with PostgreSQL), and JWT for authentication.

# Backend Design
![image alt](https://github.com/jeet004a/Air-BNB-Service/blob/e862467afdb422fdaaf2a95107439d0b125bf3c4/airbnb.png)

## API Endpoints & Their Working


Below are all user-related endpoints, their request/response formats, and how they work:

---

### 1. **User Registration (Sign Up)**

**Endpoint:**  
`POST /api/v1/auth/signup`

**How it works:**
- Accepts user details (`email`, `password`, `firstname`, `lastname`) in the request body.
- Validates all fields.
- Checks if a user with the given email already exists.
- If not, hashes the password and stores the user in the database.
- Returns a JWT token on success.

**Request Example:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword",
  "firstname": "John",
  "lastname": "Doe"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "User signed up successfully",
  "token": "<JWT_TOKEN>"
}
```

**Failure Response (e.g., user exists):**
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

---

### 2. **User Authentication (Sign In)**

**Endpoint:**  
`POST /api/v1/auth/signin`

**How it works:**
- Accepts `email` and `password` in the request body.
- Validates input.
- Checks if the user exists.
- Compares the hashed password.
- Returns a JWT token if credentials are correct.

**Request Example:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "User signed in successfully",
  "token": "<JWT_TOKEN>"
}
```

**Failure Response (e.g., wrong credentials):**
```json
{
  "success": false,
  "message": "User does not exist with this email"
}
```

---

### 3. **Get User Profile (Protected Route)**

**Endpoint:**  
`GET /api/v1/auth/profile`

**How it works:**
- Requires a valid JWT token in the `Authorization` header.
- Decodes the token and fetches user info.
- Returns the user's email (or other profile info).

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response:**
```json
{
  "success": true,
  "message": "User profile fetched successfully",
  "user": "user@example.com"
}
```

**Failure Response (e.g., invalid token):**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

## Summary Table

| Endpoint                  | Method | Body/Headers                    | Description                        |
|---------------------------|--------|----------------------------------|------------------------------------|
| /api/v1/auth/signup       | POST   | JSON: email, password, firstname, lastname | Register a new user                |
| /api/v1/auth/signin       | POST   | JSON: email, password            | Authenticate user and get JWT      |
| /api/v1/auth/profile      | GET    | Header: Authorization: Bearer    | Get current user's profile (email) |

---

**All endpoints return clear success/failure messages and use standard HTTP status codes. Frontend developers should use the JWT token returned from sign up/sign in for all protected routes.**\

## Hotel Service Database Schema

Below are the main tables and their fields used in the Hotel Service, as defined in the codebase:

---

### 1. **Manager Table**

Stores hotel manager (host) information.

| Field      | Type      | Description                |
|------------|-----------|----------------------------|
| id         | serial    | Primary key                |
| name       | varchar   | Manager's first name       |
| email      | varchar   | Unique, manager's email    |
| password   | varchar   | Hashed password            |
| salt       | varchar   | Salt for password hashing  |
| phone      | varchar   | Manager's phone number     |
| createdAt  | timestamp | Creation timestamp         |
| updatedAt  | timestamp | Last update timestamp      |

---

### 2. **Hotel Table**

Stores hotel details.

| Field      | Type      | Description                        |
|------------|-----------|------------------------------------|
| id         | serial    | Primary key                        |
| name       | varchar   | Hotel name                         |
| description| varchar   | Hotel description                  |
| address    | varchar   | Hotel address                      |
| city       | varchar   | City where hotel is located        |
| country    | varchar   | Country where hotel is located     |
| hostId     | integer   | References `manager.id`            |
| createdAt  | timestamp | Creation timestamp                 |
| updatedAt  | timestamp | Last update timestamp              |

---

### 3. **Room Table**

Stores room details for each hotel.

| Field       | Type      | Description                        |
|-------------|-----------|------------------------------------|
| id          | serial    | Primary key                        |
| hotelId     | integer   | References `hotel.id`              |
| roomType    | varchar   | Type of room (e.g., Deluxe, Suite) |
| PPN         | integer   | Price per night                    |
| max_guests  | integer   | Maximum number of guests           |
| description | text      | Room description                   |
| createdAt   | timestamp | Creation timestamp                 |
| updatedAt   | timestamp | Last update timestamp              |

---

### 4. **Room Images Table**

Stores images for each room.

| Field      | Type      | Description                        |
|------------|-----------|------------------------------------|
| id         | serial    | Primary key                        |
| roomId     | integer   | References `room.id`               |
| imageUrl   | varchar   | URL of the room image              |
| createdAt  | timestamp | Creation timestamp                 |
| updatedAt  | timestamp | Last update timestamp              |

---

**Note:**  
- All foreign keys use `onDelete: 'cascade'` to ensure related records are cleaned up automatically.
- All timestamps are set to the current time by default on creation and update.

This schema supports a flexible and scalable hotel management system for the AirBnB backend.


## Hotel Service API Endpoints & Their Working

Below are all hotel admin-related endpoints, their request/response formats, and how they work:

---

### 1. **Hotel Admin Registration (Sign Up)**

**Endpoint:**  
`POST /api/v1/admin/signup`

**How it works:**
- Accepts admin details (`email`, `password`, `name`, `phone`) in the request body.
- Validates all fields.
- Checks if an admin with the given email already exists.
- If not, hashes the password and stores the admin in the database.
- Returns a JWT token on success.

**Request Example:**
```json
{
  "email": "admin@example.com",
  "password": "yourpassword",
  "name": "Hotel Manager",
  "phone": "1234567890"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Hotel Admin Sign Up Successful",
  "token": "<JWT_TOKEN>"
}
```

**Failure Response (e.g., admin exists):**
```json
{
  "success": false,
  "message": "Hotel Admin already exists with this email"
}
```

---

### 2. **Hotel Admin Authentication (Sign In)**

**Endpoint:**  
`GET /api/v1/admin/signin`

**How it works:**
- Accepts `email` and `password` as query parameters or in the request body.
- Checks if the admin exists.
- Compares the hashed password.
- Returns a JWT token if credentials are correct.

**Request Example (as query params):**
```
GET /api/v1/admin/signin?email=admin@example.com&password=yourpassword
```

**Success Response:**
```json
{
  "success": true,
  "message": "Hotel Admin signed in successfully",
  "token": "<JWT_TOKEN>"
}
```

**Failure Response (e.g., wrong credentials):**
```json
{
  "success": false,
  "message": "User does not exist with this email"
}
```

---

### 3. **Get Hotel Admin Profile (Protected Route)**

**Endpoint:**  
`GET /api/v1/admin/profile`

**How it works:**
- Requires a valid JWT token in the `Authorization` header.
- Decodes the token and fetches admin info.
- Returns the admin's profile.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response:**
```json
{
  "success": true,
  "message": "Hotel Admin Profile",
  "user": {
    "email": "admin@example.com",
    "name": "Hotel Manager",
    "phone": "1234567890"
    // ...other fields
  }
}
```

**Failure Response (e.g., invalid token):**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

## Example Usage

### Sign Up

```bash
curl -X POST http://localhost:3001/api/v1/admin/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"yourpassword","name":"Hotel Manager","phone":"1234567890"}'
```

### Sign In

```bash
curl -X GET "http://localhost:3001/api/v1/admin/signin?email=admin@example.com&password=yourpassword"
```

### Get Profile

```bash
curl -X GET http://localhost:3001/api/v1/admin/profile \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---


## All API Endpoints Overview

Below is a summary table of all User Service and Hotel Admin Service API endpoints, their methods, required body/headers, and a brief description for frontend integration:

| Endpoint                        | Method | Body/Headers                                   | Description                                      |
|----------------------------------|--------|------------------------------------------------|--------------------------------------------------|
| /api/v1/admin/signup            | POST   | JSON: email, password, name, phone             | Register a new hotel admin (manager)             |
| /api/v1/admin/signin            | GET    | Query: email, password                         | Authenticate hotel admin and get JWT             |
| /api/v1/admin/profile           | GET    | Header: Authorization: Bearer <JWT_TOKEN>      | Get current hotel admin's profile                |

---

**All endpoints return clear success/failure messages and use standard HTTP status codes. Frontend developers should use the JWT token returned from sign up/sign in for all protected routes.**