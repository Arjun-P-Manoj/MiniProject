package BusManagementBooking.bus.booking;

import BusManagementBooking.bus.buses.BusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("booking")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class BookingController {

    @Autowired
    private BookingServiceImpl bookingServiceImpl;
    
    @Autowired
    private BusRepository busRepository;

    @GetMapping("health")
    public String checkAlive() {
        return "Booking Controller is alive!";
    }

    @PostMapping
    public ResponseEntity<?> addBooking(@RequestBody BookingAddRequestDTO bookingAddRequestDTO) {
        try {
            System.out.println("Received booking request: " + bookingAddRequestDTO);
            
            // Validate required fields in the controller
            if (bookingAddRequestDTO.getBusId() == null) {
                return ResponseEntity.badRequest().body("Bus ID is required");
            }
            
            if (bookingAddRequestDTO.getUserId() == null) {
                return ResponseEntity.badRequest().body("User ID is required");
            }
            
            if (bookingAddRequestDTO.getSeatNumber() == null || bookingAddRequestDTO.getSeatNumber().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Seat number is required");
            }
            
            // Validate if bus exists
            if (!busRepository.existsById(bookingAddRequestDTO.getBusId())) {
                return ResponseEntity.badRequest().body("Bus with ID " + bookingAddRequestDTO.getBusId() + " does not exist");
            }
            
            bookingServiceImpl.addBooking(bookingAddRequestDTO);
            return ResponseEntity.ok("Booking added successfully!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while processing your booking: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getBookings() {
        return ResponseEntity.ok(bookingServiceImpl.getBookings());
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingServiceImpl.getBookingsByUserId(userId));
    }
}
