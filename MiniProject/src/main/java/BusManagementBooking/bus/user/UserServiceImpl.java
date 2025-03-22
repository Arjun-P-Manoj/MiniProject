package BusManagementBooking.bus.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void addUser(UserAddRequestDTO userAddRequestDTO) {
        User user = new User(
                userAddRequestDTO.getName(),
                userAddRequestDTO.getEmail(),
                userAddRequestDTO.getAge(),
                userAddRequestDTO.getGender(),
                userAddRequestDTO.getRole(),
                userAddRequestDTO.getPassword(),
                userAddRequestDTO.getIsPregnant()
        );
        System.out.println("User: " + user);
        userRepository.save(user);

    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    @Override
    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }
    
    @Override
    public User authenticateUser(String email, String password) throws Exception {
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // In a real application, you should use password hashing
            if (password.equals(user.getPassword())) {
                return user;
            }
        }
        
        throw new Exception("Authentication failed");
    }
}
