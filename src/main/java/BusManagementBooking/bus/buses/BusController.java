package BusManagementBooking.bus.buses;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("bus")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class BusController {

    @Autowired
    private BusServiceImpl busServiceImpl;

    @GetMapping("health")
    public String checkAlive() {
        return "Bus Controller is alive!";
    }

    @PostMapping
    public String addBus(@RequestBody BusAddRequestDTO busAddRequestDTO) {
        busServiceImpl.addBus(busAddRequestDTO);
        return "Bus added successfully!";
    }

    @GetMapping
    public ResponseEntity<List<Bus>> getBuses() {
        return ResponseEntity.ok(busServiceImpl.getBuses());
    }
}
