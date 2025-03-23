# Bus Booking System - ER Diagram

```mermaid
erDiagram
    USER ||--o{ BOOKING : makes
    USER {
        string id PK
        string name
        string email UK
        string password
        string phone
        string role
        datetime createdAt
        datetime updatedAt
    }

    BUS ||--o{ ROUTE : has
    BUS ||--o{ SEAT : contains
    BUS {
        string id PK
        string busNumber
        string busType
        int totalSeats
        string status
        datetime createdAt
        datetime updatedAt
    }

    ROUTE ||--o{ SCHEDULE : has
    ROUTE {
        string id PK
        string source
        string destination
        float distance
        float duration
        float basePrice
        datetime createdAt
        datetime updatedAt
    }

    SCHEDULE ||--o{ BOOKING : generates
    SCHEDULE {
        string id PK
        string busId FK
        string routeId FK
        datetime departureTime
        datetime arrivalTime
        string status
        datetime createdAt
        datetime updatedAt
    }

    SEAT ||--o{ BOOKING : reserved_in
    SEAT {
        string id PK
        string busId FK
        int seatNumber
        string seatType
        float price
        boolean isAvailable
        datetime createdAt
        datetime updatedAt
    }

    BOOKING ||--o{ TRANSFER_REQUEST : has
    BOOKING {
        string id PK
        string userId FK
        string scheduleId FK
        string seatId FK
        float totalAmount
        string status
        string paymentStatus
        datetime bookingDate
        datetime createdAt
        datetime updatedAt
    }

    TRANSFER_REQUEST ||--|| TRANSFER_STATUS : has
    TRANSFER_REQUEST {
        string id PK
        string bookingId FK
        string requestedSeatId FK
        string reason
        datetime requestDate
        datetime createdAt
        datetime updatedAt
    }

    TRANSFER_STATUS {
        string id PK
        string transferRequestId FK
        string status
        string approvedBy
        datetime approvedAt
        datetime createdAt
        datetime updatedAt
    }

    PAYMENT ||--|| BOOKING : completes
    PAYMENT {
        string id PK
        string bookingId FK
        float amount
        string paymentMethod
        string transactionId
        string status
        datetime paymentDate
        datetime createdAt
        datetime updatedAt
    }

    ADMIN ||--o{ TRANSFER_STATUS : approves
    ADMIN {
        string id PK
        string userId FK
        string role
        datetime createdAt
        datetime updatedAt
    }
```

## Entity Descriptions

### 1. User
- Primary entity for user management
- Stores user authentication and profile information
- Has role-based access control (user/admin)

### 2. Bus
- Represents physical bus information
- Contains basic bus details and status
- Linked to routes and seats

### 3. Route
- Defines bus routes between locations
- Contains pricing and distance information
- Linked to schedules and buses

### 4. Schedule
- Manages bus departure and arrival times
- Links buses to routes
- Generates bookings

### 5. Seat
- Represents individual seats in a bus
- Contains seat type and pricing information
- Tracks seat availability

### 6. Booking
- Core entity for ticket booking
- Links users, schedules, and seats
- Tracks payment and booking status

### 7. Transfer Request
- Manages seat transfer requests
- Links to original booking
- Contains transfer reason

### 8. Transfer Status
- Tracks status of transfer requests
- Records admin approval information
- One-to-one relationship with transfer requests

### 9. Payment
- Handles payment information
- Links to bookings
- Tracks transaction status

### 10. Admin
- Manages administrative users
- Handles transfer approvals
- Links to user entity

## Relationships

1. **User - Booking**: One-to-Many
   - A user can have multiple bookings
   - Each booking belongs to one user

2. **Bus - Route**: One-to-Many
   - A bus can be assigned to multiple routes
   - Each route can have multiple buses

3. **Bus - Seat**: One-to-Many
   - A bus contains multiple seats
   - Each seat belongs to one bus

4. **Route - Schedule**: One-to-Many
   - A route can have multiple schedules
   - Each schedule belongs to one route

5. **Schedule - Booking**: One-to-Many
   - A schedule can generate multiple bookings
   - Each booking belongs to one schedule

6. **Seat - Booking**: One-to-Many
   - A seat can be booked multiple times
   - Each booking is for one seat

7. **Booking - Transfer Request**: One-to-Many
   - A booking can have multiple transfer requests
   - Each transfer request belongs to one booking

8. **Transfer Request - Transfer Status**: One-to-One
   - Each transfer request has one status
   - Each status belongs to one transfer request

9. **Booking - Payment**: One-to-One
   - Each booking has one payment
   - Each payment belongs to one booking

10. **Admin - Transfer Status**: One-to-Many
    - An admin can approve multiple transfers
    - Each transfer status is approved by one admin

## Notes:
1. All entities include createdAt and updatedAt timestamps
2. Foreign keys are denoted with FK suffix
3. Primary keys are denoted with PK suffix
4. Unique constraints are denoted with UK suffix
5. Relationships are enforced through foreign key constraints 