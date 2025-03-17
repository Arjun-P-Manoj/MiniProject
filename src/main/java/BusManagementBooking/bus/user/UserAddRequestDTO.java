package BusManagementBooking.bus.user;

public class UserAddRequestDTO {

    private String name;
    private String email;
    private Integer age;
    private String gender;
    private String role;
    private String password;
    private Boolean isPregnant;

    // Default Constructor
    public UserAddRequestDTO() {}

    // Parameterized Constructor
    public UserAddRequestDTO(String name, String email, Integer age, String gender, String role, String password, Boolean isPregnant) {
        this.name = name;
        this.email = email;
        this.age = age;
        this.gender = gender;
        this.role = role;
        this.password = password;
        this.isPregnant = isPregnant;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    
    public Boolean getIsPregnant() {
        return isPregnant;
    }
    
    public void setIsPregnant(Boolean isPregnant) {
        this.isPregnant = isPregnant;
    }
}
