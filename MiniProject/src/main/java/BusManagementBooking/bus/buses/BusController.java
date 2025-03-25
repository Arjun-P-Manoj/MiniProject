package BusManagementBooking.bus.buses;

import BusManagementBooking.bus.config.SeatInitializationConfig;
import BusManagementBooking.bus.seats.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("bus")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class BusController {

    @Autowired
    private BusServiceImpl busServiceImpl;
    
    @Autowired
    private SeatInitializationConfig seatInitConfig;

    @GetMapping("health")
    public String checkAlive() {
        return "Bus Controller is alive!";
    }

    @PostMapping
    public ResponseEntity<Bus> addBus(@RequestBody BusAddRequestDTO busAddRequestDTO) {
        Bus savedBus = busServiceImpl.addBus(busAddRequestDTO);
        
        // Initialize seats for the new bus
        seatInitConfig.initializeSeatsIfNeeded(savedBus);
        
        return ResponseEntity.ok(savedBus);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bus> getBusById(@PathVariable Long id) {
        return busServiceImpl.getBusById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Bus>> getBuses() {
        return ResponseEntity.ok(busServiceImpl.getBuses());
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Bus>> searchBuses(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String route) {
        return ResponseEntity.ok(busServiceImpl.searchBuses(name, route, null, null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBus(@PathVariable Long id) {
        busServiceImpl.deleteBus(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bus> updateBus(@PathVariable Long id, @RequestBody BusAddRequestDTO busUpdateRequestDTO) {
        Bus updatedBus = busServiceImpl.updateBus(id, busUpdateRequestDTO);
        if (updatedBus != null) {
            return ResponseEntity.ok(updatedBus);
        }
        return ResponseEntity.notFound().build();
    }
}