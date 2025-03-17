package BusManagementBooking.bus.user;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "age")
    private Integer age;

    @Column(name = "gender", length = 20)
    private String gender;

    @Column(name = "role", nullable = false, length = 20)
    private String role;

    @Column(name = "password", nullable = false, length = 100)
    private String password;
    
    @Column(name = "is_pregnant")
    private Boolean isPregnant;

    // Constructors
    public User() {}

    public User(String name, String email, Integer age, String gender, String role, String password, Boolean isPregnant) {
        this.name = name;
        this.email = email;
        this.age = age;
        this.gender = gender;
        this.role = role;
        this.password = password;
        this.isPregnant = isPregnant;
    }

    // Helper method to determine if user is eligible for elder priority
    public boolean isElderlyPriorityEligible() {
        return age != null && age >= 60;
    }
    
    // Helper method to determine if user is eligible for pregnant priority
    public boolean isPregnantPriorityEligible() {
        return isPregnant != null && isPregnant && "FEMALE".equalsIgnoreCase(gender);
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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
