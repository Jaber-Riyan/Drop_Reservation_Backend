# Techzu Full Stack Developer Assessment

A real-time sneaker drop reservation system built with Node.js, Express, TypeScript, PostgreSQL, and Socket.IO.

## Features

- **User Registration** — Simple username-based registration
- **Drop Management** — Create and manage limited-quantity product drops
- **Reservation System** — Reserve drops with 60-second hold time
- **Purchase Flow** — Convert reservations to purchases
- **Automatic Expiration** — Reservations expire after 60 seconds
- **Real-time Stock Updates** — Live stock counts via Socket.IO
- **Activity Feed** — Real-time purchase notifications

## Tech Stack

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL + Sequelize ORM
- Socket.IO for real-time communication

### Frontend
- React + TypeScript
- React Router DOM
- React Query (TanStack Query)
- TailwindCSS
- Socket.IO Client

## Project Structure

```
src/
├── app.ts                    # Express app configuration
├── server.ts                 # HTTP server + Socket.IO initialization
├── config/                   # Environment and database configuration
├── database/
│   └── sequelize.ts          # Sequelize instance + model loading
├── middlewares/              # Express middleware (error handling, 404)
├── modules/
│   ├── user/                 # User module
│   ├── drop/                 # Drop module
│   ├── reservation/          # Reservation module
│   ├── purchase/             # Purchase module
│   └── activity/             # Activity feed module
├── repositories/             # Base repository class
├── routes/                   # Route aggregation
├── socket/                   # Socket.IO infrastructure
│   ├── events.ts             # Event name constants
│   ├── types.ts              # TypeScript types
│   ├── middleware/            # Socket authentication
│   ├── handlers/             # Connection/disconnect handlers
│   ├── services/             # SocketService abstraction
│   └── socket.ts             # Socket.IO initialization
├── cron/                     # Scheduled jobs
└── utils/                    # Response helpers
```

## Architecture

The backend follows a strict layered architecture:

```
Route
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Sequelize Model
```

### Layer Responsibilities

- **Route** — Defines HTTP endpoints, no business logic
- **Controller** — Validates input, calls service, returns response
- **Service** — Contains all business logic and orchestration
- **Repository** — Database operations only, no business logic
- **Model** — Sequelize schema definition, no business logic

This separation ensures testability, maintainability, and clear ownership of concerns.

## Running the Project

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Backend Setup

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials

# Set up PostgreSQL database
createdb techzu_db

# Run database migrations (if using migrations)
# npm run migrate

# Start development server
npm run dev
```

Backend runs at `http://localhost:4004`

### Environment Variables

```env
NODE_ENV=development
PORT=4004
DATABASE_URL=postgresql://username:password@localhost:5432/techzu_db
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` (Vite default)

## Database Schema

### Users
- `id` — Primary key
- `username` — Unique username
- `createdAt`, `updatedAt` — Timestamps

### Drops
- `id` — Primary key
- `name` — Drop name
- `category` — Product category
- `initialStock` — Total available units
- `availableStock` — Current available units (decremented on reservation)
- `startsAt` — Drop start time
- `createdAt`, `updatedAt` — Timestamps

### Reservations
- `id` — Primary key
- `userId` — Foreign key to users
- `dropId` — Foreign key to drops
- `status` — ACTIVE, PURCHASED, or EXPIRED
- `expiresAt` — Reservation expiration timestamp
- `createdAt`, `updatedAt` — Timestamps

### Purchases
- `id` — Primary key
- `userId` — Foreign key to users
- `dropId` — Foreign key to drops
- `reservationId` — Foreign key to reservations (unique)
- `createdAt` — Timestamp

## Architecture Decisions

### 60-Second Reservation Expiration

Reservations use a centralized server-side expiration mechanism:

```
User creates reservation
  ↓
Stock decreases immediately
  ↓
Reservation expires in 60 seconds (expiresAt = createdAt + 60s)
  ↓
Cron job runs every second
  ↓
Find ACTIVE reservations where expiresAt <= NOW()
  ↓
PostgreSQL transaction
  ↓
Reservation status → EXPIRED
  ↓
Stock increases (availableStock++)
  ↓
Commit
  ↓
Socket.IO broadcasts drop:stock_updated
```

**Why this approach?**

- **Server-side authority** — Expiration logic runs only on the server, preventing client manipulation
- **Atomic updates** — Database transactions ensure stock consistency
- **Real-time notifications** — Socket.IO pushes updates to all connected clients
- **PURCHASED reservations never expire** — Only ACTIVE reservations are subject to expiration

### Concurrency Handling

Race conditions are prevented using PostgreSQL row-level locking:

```
Reservation Request
  ↓
Begin PostgreSQL Transaction
  ↓
SELECT * FROM drops WHERE id = ? FOR UPDATE
  ↓
Check availableStock > 0
  ↓
Check no existing ACTIVE reservation for user
  ↓
UPDATE drops SET availableStock = availableStock - 1
  ↓
INSERT INTO reservations (userId, dropId, status, expiresAt)
  ↓
Commit Transaction
```

**Why this works:**

- `SELECT ... FOR UPDATE` locks the row until the transaction completes
- Concurrent requests wait for the lock, then read the updated stock
- If two users try to reserve the last item simultaneously, only one transaction succeeds
- The second transaction receives an "out of stock" error and rolls back

This guarantees that inventory cannot be oversold, even under high concurrency.

### Real-time Updates

Socket.IO is used for real-time communication:

- **`drop:stock_updated`** — Broadcast globally when stock changes (reservation created or expired)
- **`reservation:created`** — Private event sent to the reserving user
- **`purchase:completed`** — Broadcast globally for activity feed updates

**Frontend integration:**

```typescript
// Socket connection
const socket = io(API_URL, { auth: { userId } });

// Listen for stock updates
socket.on('drop:stock_updated', (data) => {
  queryClient.setQueryData(['drop', data.dropId], (old) => ({
    ...old,
    availableStock: data.availableStock,
  }));
});
```

React Query cache is updated directly using `setQueryData()` instead of refetching, providing instant UI updates.

### Design Decisions

**Reservation owns inventory:**
- Stock is decremented at reservation time, not purchase time
- This prevents inventory from being held indefinitely without commitment
- If a reservation expires, stock is automatically returned

**Purchase does not modify stock:**
- Stock was already decremented during reservation
- Purchase only changes the reservation status from ACTIVE to PURCHASED
- This simplifies the purchase flow and maintains data consistency

**Purchase is the source of truth for Activity Feed:**
- Only completed purchases generate activity events
- Reservations are internal state, not user-facing events
- This keeps the activity feed clean and meaningful

**React Query manages server state:**
- All API data is cached and synchronized via React Query
- Socket.IO events update the React Query cache directly
- This provides instant UI updates without manual state management

## API Endpoints

### Users
- `POST /users` — Create user
- `GET /users` — Get all users
- `GET /users/:id` — Get user by ID

### Drops
- `POST /drops` — Create drop
- `GET /drops` — Get all drops
- `GET /drops/:id` — Get drop by ID
- `PATCH /drops/:id` — Update drop
- `DELETE /drops/:id` — Delete drop

### Reservations
- `POST /reservations` — Create reservation
- `GET /reservations` — Get all reservations
- `GET /reservations/:id` — Get reservation by ID
- `GET /reservations/user/:userId` — Get active reservations for user

### Purchases
- `POST /purchases` — Create purchase from reservation
- `GET /purchases` — Get all purchases
- `GET /purchases/:id` — Get purchase by ID

## Socket.IO Events

### Connection
```typescript
io(API_URL, { auth: { userId } })
```

### Events Received
- `drop:stock_updated` — Stock count changed
- `reservation:created` — Reservation confirmed (private)
- `purchase:completed` — New purchase made (activity feed)

## Future Improvements

- **JWT Authentication** — Replace simple userId auth with JWT tokens
- **BullMQ Delayed Jobs** — Replace polling cron with BullMQ delayed job queue
- **Redis Adapter** — Scale Socket.IO across multiple server instances
- **Docker Deployment** — Containerize for consistent deployments
- **CI/CD Pipeline** — Automated testing and deployment
- **Unit & Integration Tests** — Comprehensive test coverage
- **Rate Limiting** — Prevent abuse of reservation endpoints
- **Request Idempotency** — Prevent duplicate reservations on retry

## License

ISC