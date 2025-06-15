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


## Admin Service API Endpoints & Their Working

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

## Hotel Service API Endpoints & Their Working

---

### 1. **Create Hotel (Admin Only)**

**Endpoint:**  
`POST /api/v1/hotel/create`

**How it works:**
- Requires a valid JWT token in the `Authorization` header (admin only).
- Accepts hotel details (`name`, `description`, `address`, `city`, `country`, `pincode`, `roomCapacity`) in the request body.
- Associates the hotel with the authenticated admin.
- Returns the created hotel details on success.

**Request Example:**
```json
{
  "name": "Hotel Paradise",
  "description": "A luxury hotel in the city center.",
  "address": "123 Main St",
  "city": "Metropolis",
  "country": "Wonderland",
  "pincode": "123456",
  "roomCapacity": 10
}
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response:**
```json
{
  "success": true,
  "message": "Hotel created successfully",
  "details": {
    "id": 1,
    "name": "Hotel Paradise",
    "description": "A luxury hotel in the city center.",
    "address": "123 Main St",
    "city": "Metropolis",
    "country": "Wonderland",
    "pincode": "123456",
    "roomCapacity": 10,
    "hostId": 1,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Failure Response:**
```json
{
  "success": false,
  "message": "Hotel already exists for this manager or this email id"
}
```

---

### 2. **Update Room Capacity (Admin Only)**

**Endpoint:**  
`PATCH /api/v1/hotel/update/:id`

**How it works:**
- Requires a valid JWT token in the `Authorization` header (admin only).
- Accepts `roomCapacity` in the request body.
- Updates the room capacity for the specified hotel.

**Request Example:**
```json
{
  "roomCapacity": 15
}
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response:**
```json
{
  "success": true,
  "message": "Room capacity updated successfully",
  "updateStatus": "Now remaining room capacity 10 becuase your already listed 5 number of rooms"
}
```

---

### 3. **Get All Hotels**

**Endpoint:**  
`GET /api/v1/hotel/getAllHotels?limit=10&page=1`

**How it works:**
- Returns a paginated list of all hotels.
- Accepts `limit` and `page` as query parameters.

**Success Response:**
```json
{
  "success": true,
  "message": "All hotels fetched successfully",
  "recordCount": [{ "count": 20 }],
  "prevPage": 0,
  "nextPage": 10,
  "details": [
    {
      "id": 1,
      "name": "Hotel Paradise",
      "description": "...",
      "address": "...",
      "city": "...",
      "country": "...",
      "pincode": "...",
      "roomCapacity": 10,
      "hostId": 1,
      "createdAt": "...",
      "updatedAt": "..."
    }
    // ...more hotels
  ]
}
```

---

## Room Service API Endpoints & Their Working

---

### 1. **Create Room (Admin Only)**

**Endpoint:**  
`POST /api/v1/room/create`

**How it works:**
- Requires a valid JWT token in the `Authorization` header (admin only).
- Accepts room details (`roomType`, `PPN`, `max_guests`, `description`) in the request body.
- Associates the room with the admin's hotel.
- Decreases hotel room capacity by 1 if successful.

**Request Example:**
```json
{
  "roomType": "single",
  "PPN": 100,
  "max_guests": 2,
  "description": "Cozy single room"
}
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response:**
```json
{
  "success": true,
  "message": "Room created successfully with id: 5"
}
```

**Failure Response (e.g., no capacity):**
```json
{
  "success": false,
  "message": "No room capacity left or room creation failed"
}
```

---

### 2. **Get All Rooms for Admin (Admin Only)**

**Endpoint:**  
`GET /api/v1/room/admin/all`

**How it works:**
- Requires a valid JWT token in the `Authorization` header (admin only).
- Returns all rooms for the authenticated admin's hotel(s).

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response:**
```json
{
  "success": true,
  "message": "fetched successfully",
  "response": [
    {
      "id": 1,
      "hotelId": 1,
      "roomType": "single",
      "PPN": 100,
      "max_guests": 2,
      "description": "Cozy single room",
      "createdAt": "...",
      "updatedAt": "..."
    }
    // ...more rooms
  ]
}
```

---

### 3. **Get All Rooms (Public)**

**Endpoint:**  
`GET /api/v1/room/all`

**How it works:**
- Returns all rooms across all hotels.

**Success Response:**
```json
{
  "success": true,
  "message": "All rooms fetched successfully",
  "response": [
    {
      "id": 1,
      "hotelId": 1,
      "roomType": "single",
      "PPN": 100,
      "max_guests": 2,
      "description": "Cozy single room",
      "createdAt": "...",
      "updatedAt": "..."
    }
    // ...more rooms
  ]
}
```

---

## API Endpoints Table

| Endpoint                                 | Method | Body/Headers                                   | Description                                      |
|-------------------------------------------|--------|------------------------------------------------|--------------------------------------------------|
| /api/v1/auth/signup                      | POST   | JSON: email, password, firstname, lastname     | Register a new user                              |
| /api/v1/auth/signin                      | POST   | JSON: email, password                          | Authenticate user and get JWT                    |
| /api/v1/auth/profile                     | GET    | Header: Authorization: Bearer <JWT_TOKEN>      | Get current user's profile (email)               |
| /api/v1/admin/signup                     | POST   | JSON: email, password, name, phone             | Register a new hotel admin (manager)             |
| /api/v1/admin/signin                     | GET    | Query: email, password                         | Authenticate hotel admin and get JWT             |
| /api/v1/admin/profile                    | GET    | Header: Authorization: Bearer <JWT_TOKEN>      | Get current hotel admin's profile                |
| /api/v1/hotel/create                     | POST   | JSON: hotel details, Header: Bearer <JWT_TOKEN>| Create a new hotel (admin only)                  |
| /api/v1/hotel/update/:id                 | PATCH  | JSON: roomCapacity, Header: Bearer <JWT_TOKEN> | Update room capacity for a hotel (admin only)    |
| /api/v1/hotel/getAllHotels               | GET    | Query: limit, page                             | Get all hotels (paginated)                       |
| /api/v1/room/create                      | POST   | JSON: room details, Header: Bearer <JWT_TOKEN> | Create a new room for admin's hotel              |
| /api/v1/room/admin/all                   | GET    | Header: Authorization: Bearer <JWT_TOKEN>      | Get all rooms for admin's hotel(s)               |
| /api/v1/room/all                         | GET    |                                                | Get all

**All endpoints return clear success/failure messages and use standard HTTP status codes. Frontend developers should use the JWT token returned from sign up/sign in for**