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

**All endpoints return clear success/failure messages and use standard HTTP status codes. Frontend developers should use the JWT token returned from sign up/sign in for all protected routes.**