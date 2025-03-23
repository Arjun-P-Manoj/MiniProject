package BusManagementBooking.bus.booking;

import BusManagementBooking.bus.buses.BusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/booking")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class BookingController {

    @Autowired
    private BookingServiceImpl bookingServiceImpl;
    
    @Autowired
    private BusRepository busRepository;

    @GetMapping("/health")
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
            
            Booking booking = bookingServiceImpl.addBooking(bookingAddRequestDTO);
            return ResponseEntity.ok(booking);
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
    
    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long bookingId) {
        try {
            boolean cancelled = bookingServiceImpl.cancelBooking(bookingId);
            if (cancelled) {
                return ResponseEntity.ok("Booking cancelled successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Booking with ID " + bookingId + " not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while cancelling the booking: " + e.getMessage());
        }
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transferSeat(@RequestBody TransferRequest transferRequest) {
        try {
            System.out.println("=== Transfer Seat Request ===");
            System.out.println("Endpoint: /booking/transfer");
            System.out.println("Request body: " + transferRequest);
            System.out.println("Booking ID: " + transferRequest.getBookingId());
            System.out.println("New Bus ID: " + transferRequest.getNewBusId());
            System.out.println("New Seat ID: " + transferRequest.getNewSeatId());
            
            if (transferRequest.getBookingId() == null) {
                return ResponseEntity.badRequest().body("Booking ID is required");
            }
            
            if (transferRequest.getNewBusId() == null) {
                return ResponseEntity.badRequest().body("New Bus ID is required");
            }
            
            if (transferRequest.getNewSeatId() == null) {
                return ResponseEntity.badRequest().body("New Seat ID is required");
            }
            
            bookingServiceImpl.transferSeat(
                transferRequest.getBookingId(),
                transferRequest.getNewBusId(),
                transferRequest.getNewSeatId()
            );
            System.out.println("Transfer completed successfully");
            return ResponseEntity.ok("Seat transferred successfully");
        } catch (Exception e) {
            System.err.println("=== Transfer Failed ===");
            System.err.println("Error message: " + e.getMessage());
            System.err.println("Stack trace:");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Transfer failed: " + e.getMessage());
        }
    }
}
