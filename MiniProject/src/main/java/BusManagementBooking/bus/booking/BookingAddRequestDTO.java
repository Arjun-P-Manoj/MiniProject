package BusManagementBooking.bus.booking;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BookingAddRequestDTO {
    private Long userId;
    private Long busId;
    private LocalDateTime bookingDate;
    private String seatNumber;
    private BigDecimal amount;
    private String status;

    // Constructors
    public BookingAddRequestDTO() {}

    public BookingAddRequestDTO(Long userId, Long busId, LocalDateTime bookingDate, String seatNumber, BigDecimal amount, String status) {
        this.userId = userId;
        this.busId = busId;
        this.bookingDate = bookingDate;
        this.seatNumber = seatNumber;
        this.amount = amount;
        this.status = status;
    }

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getBusId() {
        return busId;
    }

    public void setBusId(Long busId) {
        this.busId = busId;
    }

    public LocalDateTime getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDateTime bookingDate) {
        this.bookingDate = bookingDate;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
} 