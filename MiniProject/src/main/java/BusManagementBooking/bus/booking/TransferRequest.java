package BusManagementBooking.bus.booking;

public class TransferRequest {
    private Long bookingId;
    private Long newBusId;
    private Long newSeatId;

    // Getters and Setters
    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public Long getNewBusId() {
        return newBusId;
    }

    public void setNewBusId(Long newBusId) {
        this.newBusId = newBusId;
    }

    public Long getNewSeatId() {
        return newSeatId;
    }

    public void setNewSeatId(Long newSeatId) {
        this.newSeatId = newSeatId;
    }

    @Override
    public String toString() {
        return "TransferRequest{" +
                "bookingId=" + bookingId +
                ", newBusId=" + newBusId +
                ", newSeatId=" + newSeatId +
                '}';
    }
} 