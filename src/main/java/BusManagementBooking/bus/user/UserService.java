package BusManagementBooking.bus.user;

import java.util.List;
import java.util.Optional;

public interface UserService {
    void addUser(UserAddRequestDTO userAddRequestDTO);
    List<User> getAllUsers();
    Optional<User> getUserByEmail(String email);
    User authenticateUser(String email, String password) throws Exception;
}
