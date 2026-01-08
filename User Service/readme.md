# AirBnB User Service

This project is the **User Service** for an AirBnB-like platform. It provides RESTful APIs for user authentication, registration, and profile management. The backend is built using Node.js, Express, Drizzle ORM (with PostgreSQL), and JWT for authentication.

---

## Features

- User registration (sign up)
- User authentication (sign in)
- JWT-based session management
- User profile retrieval (protected route)
- Email notification on signup and login (AWS SNS)
- Input validation and error handling

---

## API Endpoints & Their Working

### 1. User Registration (Sign Up)

**Endpoint:**  
`POST /api/v1/auth/signup`

**How it works:**
- Accepts user details (`email`, `password`, `firstname`, `lastname`) in the request body.
- Validates all fields.
- Checks if a user with the given email already exists.
- If not, hashes the password and stores the user in the database.
- Sends an email notification via AWS SNS.
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

**Failure Response (user exists):**
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

---

### 2. User Authentication (Sign In)

**Endpoint:**  
`GET /api/v1/auth/signin`

**How it works:**
- Accepts `email` and `password` in the request body.
- Validates input.
- Checks if the user exists.
- Compares the hashed password.
- Sends a login notification via AWS SNS.
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

**Failure Response (wrong credentials):**
```json
{
  "success": false,
  "message": "User does not exist with this email"
}
```

---

### 3. Get User Profile (Protected Route)

**Endpoint:**  
`GET /api/v1/auth/profile`

**How it works:**
- Requires a valid JWT token in the `Authorization` header.
- Decodes the token and fetches user info from the database.
- Returns the user's email and profile details.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response:**
```json
{
  "success": true,
  "message": "User profile fetched successfully",
  "user": "user@example.com",
  "userDetails": {
    "id": 1,
    "firstname": "John",
    "lastname": "Doe",
    "email": "user@example.com",
    "password": "<hashed>",
    "salt": "<salt>",
    "createdAt": "2024-08-03T12:00:00.000Z"
  }
}
```

**Failure Response (invalid token):**
```json
{
  "success": false,
  "message": "User Not found"
}
```

---

## Example Usage

### Sign Up

```bash
curl -X POST http://localhost:3001/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"yourpassword","firstname":"John","lastname":"Doe"}'
```

### Sign In

```bash
curl -X GET http://localhost:3001/api/v1/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"yourpassword"}'
```

### Get Profile

```bash
curl -X GET http://localhost:3001/api/v1/auth/profile \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

## Modules Used and Why

This service uses the following main modules:

- **express**: For building the REST API server and handling routing.
- **express-validator**: For validating and sanitizing incoming request data to ensure data integrity and security.
- **jsonwebtoken (jwt)**: For securely generating and verifying JWT tokens for authentication and protected routes.
- **drizzle-orm**: For interacting with the PostgreSQL database in a type-safe and efficient way.
- **pg**: PostgreSQL client for Node.js, used by Drizzle ORM to connect to the database.
- **bcrypt**: For hashing and salting user passwords before storing them in the database, enhancing security.
- **dotenv**: For loading environment variables from a `.env` file, keeping sensitive data like database URLs and secrets out of the codebase.
- **aws-sdk (SNSClient)**: For sending email notifications via AWS SNS on user signup and login events.

**Why these modules?**
- They are industry-standard, well-maintained, and provide robust solutions for authentication, validation, database access, and notifications.
- They help keep the codebase secure, maintainable, and scalable for production-ready applications.

## User Table Schema

| Field      | Type      | Description                |
|------------|-----------|----------------------------|
| id         | serial    | Primary key                |
| firstname  | varchar   | User's first name          |
| lastname   | varchar   | User's last name           |
| email      | varchar   | Unique, user's email       |
| password   | varchar   | Hashed password            |
| salt       | varchar   | Salt for password hashing  |
| createdAt  | timestamp | Creation timestamp         |

---

## API Endpoints Table

| Endpoint                  | Method | Body/Headers                                   | Description                        |
|---------------------------|--------|------------------------------------------------|------------------------------------|
| /api/v1/auth/signup       | POST   | JSON: email, password, firstname, lastname     | Register a new user                |
| /api/v1/auth/signin       | GET    | JSON: email, password                          | Authenticate user and get JWT      |
| /api/v1/auth/profile      | GET    | Header: Authorization: Bearer <JWT_TOKEN>      | Get current user's profile         |

---

**All endpoints return clear success/failure messages and use standard HTTP status codes. Frontend developers should use the JWT token returned from sign up/sign in for all