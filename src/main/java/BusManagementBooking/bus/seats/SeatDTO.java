package BusManagementBooking.bus.seats;

public class SeatDTO {
    private Long id;
    private String seatNumber;
    private String seatType;
    private String status;
    private Long busId;

    public SeatDTO() {}

    public SeatDTO(Long id, String seatNumber, String seatType, String status, Long busId) {
        this.id = id;
        this.seatNumber = seatNumber;
        this.seatType = seatType;
        this.status = status;
        this.busId = busId;
    }

    // Static method to convert Seat entity to DTO
    public static SeatDTO fromEntity(Seat seat) {
        Long busId = null;
        try {
            // Try to get the bus ID, but handle potential LazyInitializationException
            if (seat.getBus() != null) {
                busId = seat.getBus().getId();
            }
        } catch (Exception e) {
            // If we can't get the bus ID (lazy loading issue), use the field directly
            // This is a fallback and might require a database lookup
            busId = null;
        }
        
        return new SeatDTO(
            seat.getId(),
            seat.getSeatNumber(),
            seat.getSeatType().toString(),
            seat.getStatus().toString(),
            busId
        );
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public String getSeatType() {
        return seatType;
    }

    public void setSeatType(String seatType) {
        this.seatType = seatType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getBusId() {
        return busId;
    }

    public void setBusId(Long busId) {
        this.busId = busId;
    }
} 