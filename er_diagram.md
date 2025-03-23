# Bus Booking System - ER Diagram

```mermaid
erDiagram
    USER ||--o{ BOOKING : makes
    USER {
        string id PK
        string username
        string email
        string password
        string role
        string phoneNumber
        date dateOfBirth
        string gender
    }

    BOOKING ||--o{ SEAT : contains
    BOOKING {
        string id PK
        string userId FK
        string busId FK
        date bookingDate
        string status
        float totalAmount
        string paymentStatus
    }

    BUS ||--o{ BOOKING : receives
    BUS {
        string id PK
        string name
        string route
        string departureTime
        string arrivalTime
        float price
        int totalSeats
        int availableSeats
    }

    SEAT {
        string id PK
        string bookingId FK
        string seatNumber
        string seatType
        string status
    }

    PAYMENT ||--o{ BOOKING : processes
    PAYMENT {
        string id PK
        string bookingId FK
        float amount
        string paymentMethod
        string status
        date paymentDate
    }

    ADMIN ||--o{ BUS : manages
    ADMIN {
        string id PK
        string username
        string email
        string password
        string role
    }