package BusManagementBooking.bus.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("users")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("health")
    public String checkAlive() {
        return "User Controller is alive!";
    }

    @PostMapping
    public ResponseEntity<String> addUser(@RequestBody UserAddRequestDTO userAddRequestDTO) {
        userService.addUser(userAddRequestDTO);
        return ResponseEntity.ok("User added successfully!");
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{email}")
    public ResponseEntity<Optional<User>> getUserByEmail(@PathVariable String email) {
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }
    
    @GetMapping("/{userId}/priority")
    public ResponseEntity<?> getUserPriorityInfo(@PathVariable Long userId) {
        Optional<User> userOptional = userService.getUserById(userId);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            UserPriorityInfoDTO priorityInfo = new UserPriorityInfoDTO(user);
            return ResponseEntity.ok(priorityInfo);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        try {
            User authenticatedUser = userService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());
            return ResponseEntity.ok(authenticatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }
}
