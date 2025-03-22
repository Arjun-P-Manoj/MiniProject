package BusManagementBooking.bus.user;

public class LoginRequestDTO {
    private String email;
    private String password;

    // Default constructor
    public LoginRequestDTO() {
    }

    // Parameterized constructor
    public LoginRequestDTO(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Getters and Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
} 