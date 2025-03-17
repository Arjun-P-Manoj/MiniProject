package BusManagementBooking.bus.seats;

public class SeatInitRequestDTO {
    private Long busId;
    private int regularSeats;
    private int elderSeats;
    private int pregnantSeats;

    // Constructors
    public SeatInitRequestDTO() {}

    public SeatInitRequestDTO(Long busId, int regularSeats, int elderSeats, int pregnantSeats) {
        this.busId = busId;
        this.regularSeats = regularSeats;
        this.elderSeats = elderSeats;
        this.pregnantSeats = pregnantSeats;
    }

    // Getters and Setters
    public Long getBusId() {
        return busId;
    }

    public void setBusId(Long busId) {
        this.busId = busId;
    }

    public int getRegularSeats() {
        return regularSeats;
    }

    public void setRegularSeats(int regularSeats) {
        this.regularSeats = regularSeats;
    }

    public int getElderSeats() {
        return elderSeats;
    }

    public void setElderSeats(int elderSeats) {
        this.elderSeats = elderSeats;
    }

    public int getPregnantSeats() {
        return pregnantSeats;
    }

    public void setPregnantSeats(int pregnantSeats) {
        this.pregnantSeats = pregnantSeats;
    }
} 