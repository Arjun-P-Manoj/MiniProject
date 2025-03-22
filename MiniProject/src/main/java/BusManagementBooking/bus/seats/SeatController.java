package BusManagementBooking.bus.seats;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("seat")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class SeatController {

    @Autowired
    private SeatService seatService;

    @GetMapping("/health")
    public String checkAlive() {
        return "Seat Controller is alive!";
    }

    @PostMapping("/initialize")
    public ResponseEntity<?> initializeSeats(@RequestBody SeatInitRequestDTO request) {
        try {
            if (request.getBusId() == null) {
                return ResponseEntity.badRequest().body("Bus ID is required");
            }
            
            seatService.initializeSeatsForBus(
                request.getBusId(),
                request.getRegularSeats(),
                request.getElderSeats(),
                request.getPregnantSeats()
            );
            return ResponseEntity.ok("Seats initialized successfully for bus ID: " + request.getBusId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error initializing seats: " + e.getMessage());
        }
    }

    @GetMapping("/bus/{busId}")
    public ResponseEntity<?> getSeatsByBusId(@PathVariable Long busId) {
        try {
            List<SeatDTO> seats = seatService.getSeatsByBusId(busId);
            return ResponseEntity.ok(seats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving seats: " + e.getMessage());
        }
    }

    @GetMapping("/bus/{busId}/available")
    public ResponseEntity<?> getAvailableSeatsByBusId(@PathVariable Long busId) {
        try {
            List<SeatDTO> seats = seatService.getAvailableSeatsByBusId(busId);
            return ResponseEntity.ok(seats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving available seats: " + e.getMessage());
        }
    }

    @GetMapping("/bus/{busId}/available/{seatType}")
    public ResponseEntity<?> getAvailableSeatsByTypeAndBusId(
            @PathVariable Long busId,
            @PathVariable String seatType) {
        try {
            List<SeatDTO> seats = seatService.getAvailableSeatsByTypeAndBusId(busId, seatType);
            return ResponseEntity.ok(seats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving available seats by type: " + e.getMessage());
        }
    }

    @GetMapping("/bus/{busId}/count")
    public ResponseEntity<?> getSeatCountByBusId(@PathVariable Long busId) {
        try {
            Map<String, Integer> seatCounts = seatService.getSeatCountByBusId(busId);
            return ResponseEntity.ok(seatCounts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving seat counts: " + e.getMessage());
        }
    }

    @PutMapping("/{seatId}/status")
    public ResponseEntity<?> updateSeatStatus(
            @PathVariable Long seatId,
            @RequestParam String status) {
        try {
            SeatDTO updatedSeat = seatService.updateSeatStatus(seatId, status);
            return ResponseEntity.ok(updatedSeat);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating seat status: " + e.getMessage());
        }
    }

    @DeleteMapping("/bus/{busId}")
    public ResponseEntity<?> deleteSeatsForBus(@PathVariable Long busId) {
        try {
            seatService.deleteSeatsForBus(busId);
            return ResponseEntity.ok("Seats deleted successfully for bus ID: " + busId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting seats: " + e.getMessage());
        }
    }
} 