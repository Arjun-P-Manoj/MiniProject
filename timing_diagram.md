# Bus Booking System - Timing Diagram

## 1. User Registration Flow
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database

    User->>Frontend: Fill registration form
    Frontend->>Frontend: Validate form data
    Frontend->>Backend: POST /api/auth/register
    Backend->>Backend: Validate data
    Backend->>Database: Check email exists
    Database-->>Backend: Email status
    Backend->>Backend: Hash password
    Backend->>Database: Create user record
    Database-->>Backend: User created
    Backend-->>Frontend: Registration success
    Frontend-->>User: Show success message
```

## 2. Bus Booking Flow
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    participant Payment Gateway

    User->>Frontend: Search buses
    Frontend->>Backend: GET /api/buses/search
    Backend->>Database: Query available buses
    Database-->>Backend: Bus list
    Backend-->>Frontend: Return bus options
    Frontend-->>User: Display results

    User->>Frontend: Select bus & seats
    Frontend->>Backend: POST /api/bookings/create
    Backend->>Database: Check seat availability
    Database-->>Backend: Availability status
    Backend->>Payment Gateway: Process payment
    Payment Gateway-->>Backend: Payment status
    Backend->>Database: Create booking
    Database-->>Backend: Booking created
    Backend-->>Frontend: Booking confirmation
    Frontend-->>User: Show success & receipt
```

## 3. Seat Transfer Flow
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    participant Admin

    User->>Frontend: Initiate seat transfer
    Frontend->>Backend: POST /api/transfers/request
    Backend->>Database: Validate booking
    Database-->>Backend: Booking details
    Backend->>Database: Create transfer request
    Database-->>Backend: Request created
    Backend-->>Frontend: Request submitted
    Frontend-->>User: Show confirmation

    Admin->>Backend: Review transfer request
    Backend->>Database: Get transfer details
    Database-->>Backend: Transfer info
    Admin->>Backend: Approve/Reject transfer
    Backend->>Database: Update transfer status
    Database-->>Backend: Status updated
    Backend-->>Frontend: Transfer result
    Frontend-->>User: Show transfer status
```

## 4. Booking History Flow
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database

    User->>Frontend: View booking history
    Frontend->>Backend: GET /api/bookings/history
    Backend->>Backend: Validate JWT token
    Backend->>Database: Query user bookings
    Database-->>Backend: Booking list
    Backend-->>Frontend: Return bookings
    Frontend-->>User: Display history

    User->>Frontend: Download receipt
    Frontend->>Backend: GET /api/bookings/:id/receipt
    Backend->>Database: Get booking details
    Database-->>Backend: Booking info
    Backend->>Backend: Generate PDF
    Backend-->>Frontend: PDF data
    Frontend-->>User: Download receipt
```

## 5. Admin Management Flow
```mermaid
sequenceDiagram
    participant Admin
    participant Frontend
    participant Backend
    participant Database

    Admin->>Frontend: Access admin panel
    Frontend->>Backend: GET /api/admin/verify
    Backend->>Backend: Validate admin token
    Backend-->>Frontend: Admin access granted
    Frontend-->>Admin: Show admin dashboard

    Admin->>Frontend: Manage routes
    Frontend->>Backend: POST /api/admin/routes
    Backend->>Database: Update routes
    Database-->>Backend: Update status
    Backend-->>Frontend: Route updated
    Frontend-->>Admin: Show confirmation

    Admin->>Frontend: Manage bookings
    Frontend->>Backend: GET /api/admin/bookings
    Backend->>Database: Query all bookings
    Database-->>Backend: Booking list
    Backend-->>Frontend: Return bookings
    Frontend-->>Admin: Display bookings
```

## Notes:
1. All API calls include authentication headers
2. Error handling and validation occur at each step
3. Real-time updates are implemented for seat availability
4. Database operations are atomic and include proper locking
5. All sensitive data is encrypted in transit and at rest 