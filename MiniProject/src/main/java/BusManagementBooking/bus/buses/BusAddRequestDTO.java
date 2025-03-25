package BusManagementBooking.bus.buses;

public class BusAddRequestDTO {

    private String name;
    private String route;
    private String departureDate;
    private String departureTime;
    private String arrivalTime;
    private Integer availableSeats;
    private Integer totalSeats;
    private double price;

    // Default Constructor
    public BusAddRequestDTO() {}

    // Parameterized Constructor
    public BusAddRequestDTO(String name, String route, String departureDate, String departureTime, String arrivalTime,
                            Integer availableSeats, Integer totalSeats, double price) {
        this.name = name;
        this.route = route;
        this.departureDate = departureDate;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.availableSeats = availableSeats;
        this.totalSeats = totalSeats;
        this.price = price;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRoute() {
        return route;
    }

    public void setRoute(String route) {
        this.route = route;
    }

    public String getDepartureDate() {
        return departureDate;
    }

    public void setDepartureDate(String departureDate) {
        this.departureDate = departureDate;
    }

    public String getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(String departureTime) {
        this.departureTime = departureTime;
    }

    public String getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(String arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public Integer getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats;
    }

    public Integer getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(Integer totalSeats) {
        this.totalSeats = totalSeats;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}
