# AirBnB Payment Service

This service handles all payment and cancellation operations for the AirBnB platform. It uses PostgreSQL for data storage, Drizzle ORM for database access, and Kafka (via kafkajs) for event-driven communication between microservices.

---

## Features

- **Payment Processing:** Handles new payments for bookings.
- **Order Cancellation:** Handles cancellation requests for bookings.
- **Event Publishing:** Publishes payment and cancellation events to Kafka topics for other services to consume.
- **Idempotency:** Prevents duplicate payments or cancellations for the same booking.
- **Microservice Communication:** Uses Kafka for reliable, decoupled event delivery.

---

## API Endpoints & Their Working

### 1. Make a Payment

**Endpoint:**  
`POST /api/v1/payment`

**How it works:**
- Accepts payment details in the request body.
- Checks if a payment for the given booking already exists (idempotency).
- If not, creates a new payment record.
- Publishes a `payment-completed` event to the `PaymentSuccessEvents` Kafka topic.
- Returns success or error message.

**Request Example:**
```json
{
  "bookingId": 101,
  "userId": 1,
  "hotelId": 2,
  "roomId": 5,
  "totalPrice": 1200,
  "paymentStatus": "completed"
}
```

**Success Response:**
```json
{
  "success": true,
  "msg": "Payment successfully"
}
```

**Failure Response (duplicate payment):**
```json
{
  "success": false,
  "msg": "This Order Payment is already Successful",
  "rec": [ /* existing payment record */ ]
}
```

---

### 2. Cancel an Order

**Endpoint:**  
`POST /api/v1/cancel`

**How it works:**
- Accepts cancellation details in the request body.
- Checks if a payment or cancellation already exists for the booking.
- If not, creates a new cancellation record.
- Publishes a `payment-cancel` event to the `PaymentCancelEvents` Kafka topic.
- Returns success or error message.

**Request Example:**
```json
{
  "bookingId": 101,
  "userId": 1,
  "hotelId": 2,
  "roomId": 5,
  "totalPrice": 1200,
  "paymentStatus": "canceled"
}
```

**Success Response:**
```json
{
  "success": true,
  "msg": "Order Cancel successfully"
}
```

**Failure Response (already canceled):**
```json
{
  "success": false,
  "msg": "Order is already canceled",
  "rec": [ /* existing cancel record */ ]
}
```

---

## Example Usage

### Make a Payment

```bash
curl -X POST http://localhost:3001/api/v1/payment \
  -H "Content-Type: application/json" \
  -d '{"bookingId":101,"userId":1,"hotelId":2,"roomId":5,"totalPrice":1200,"paymentStatus":"completed"}'
```

### Cancel an Order

```bash
curl -X POST http://localhost:3001/api/v1/cancel \
  -H "Content-Type: application/json" \
  -d '{"bookingId":101,"userId":1,"hotelId":2,"roomId":5,"totalPrice":1200,"paymentStatus":"canceled"}'
```

---

## Database Tables

### Payment Table

| Field         | Type      | Description                        |
|---------------|-----------|------------------------------------|
| id            | serial    | Primary key                        |
| paymentId     | text      | Unique payment identifier (UUID)   |
| bookingId     | integer   | Unique booking identifier          |
| userId        | integer   | User who made the payment          |
| hotelId       | integer   | Hotel for the booking              |
| roomId        | integer   | Room for the booking               |
| totalPrice    | integer   | Total payment amount               |
| paymentStatus | enum      | Payment status (pending, canceled, completed) |
| createdAt     | timestamp | Creation timestamp                 |
| updatedAt     | timestamp | Last update timestamp              |

### Cancel Order Table

| Field         | Type      | Description                        |
|---------------|-----------|------------------------------------|
| id            | serial    | Primary key                        |
| bookingId     | integer   | Unique booking identifier          |
| userId        | integer   | User who canceled                  |
| hotelId       | integer   | Hotel for the booking              |
| roomId        | integer   | Room for the booking               |
| totalPrice    | integer   | Total payment amount               |
| paymentStatus | enum      | Payment status (pending, canceled, completed) |
| createdAt     | timestamp | Creation timestamp                 |
| updatedAt     | timestamp | Last update timestamp              |

---

## API Endpoints Table

| Endpoint           | Method | Body/Headers         | Description                      |
|--------------------|--------|----------------------|----------------------------------|
| /api/v1/payment    | POST   | JSON: payment data   | Make a payment for a booking     |
| /api/v1/cancel     | POST   | JSON: cancel data    | Cancel a booking/payment         |

---

## Kafka in This Microservice

### Why Kafka?

- **Decoupling:** Kafka allows the payment service to notify other microservices (like booking, notification, analytics) about payment and cancellation events without direct API calls.
- **Reliability:** Kafka ensures that events are delivered even if other services are temporarily unavailable.
- **Scalability:** Kafka can handle high-throughput event streams and multiple consumers.

### How Kafka Works Here

1. **Producer:**  
   - The payment service acts as a producer, publishing events to Kafka topics (`PaymentSuccessEvents`, `PaymentCancelEvents`) after successful payment or cancellation.
   - The `publish` function connects to Kafka, creates topics if needed, and sends messages with event keys and payloads.

2. **Consumer:**  
   - The service can also act as a consumer, subscribing to relevant topics and handling incoming events.
   - The `subscribe` function connects to Kafka, subscribes to a topic, and processes each message with a handler (e.g., `HandleSubsrciption`).

3. **Topics:**  
   - `PaymentSuccessEvents`: Receives events when a payment is completed.
   - `PaymentCancelEvents`: Receives events when a payment is canceled.

4. **Event Structure:**  
   - Each event includes headers, a key (event type), and a JSON-encoded message (payload).

5. **Idempotency:**  
   - Before processing, the service checks if the payment or cancellation already exists to avoid duplicate events.

### Example Kafka Event Flow

- **Payment:**  
  1. User makes a payment.
  2. Payment is recorded in the database.
  3. `payment-completed` event is published to `PaymentSuccessEvents`.
  4. Other services (e.g., booking, notification) consume this event and update their state.

- **Cancellation:**  
  1. User cancels a booking.
  2. Cancellation is recorded in the database.
  3. `payment-cancel` event is published to `PaymentCancelEvents`.
  4. Other services consume this event and update their state.

---

**This architecture ensures reliable, scalable, and decoupled communication between microservices using