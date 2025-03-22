package BusManagementBooking.bus.config;

import BusManagementBooking.bus.buses.Bus;
import BusManagementBooking.bus.buses.BusService;
import BusManagementBooking.bus.seats.SeatInitRequestDTO;
import BusManagementBooking.bus.seats.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;

@Configuration
public class SeatInitializationConfig {

    @Autowired
    private BusService busService;

    @Autowired
    private SeatService seatService;
    
    @Value("${bus.seats.elder.percentage:10}")
    private int elderSeatPercentage;
    
    @Value("${bus.seats.pregnant.percentage:10}")
    private int pregnantSeatPercentage;
    
    /**
     * Initialize seats for buses that don't have seat configurations
     */
    @EventListener
    public void onApplicationEvent(ContextRefreshedEvent event) {
        // This will run once when the application starts
        busService.getBuses().forEach(this::initializeSeatsIfNeeded);
    }
    
    /**
     * Helper method to calculate seat distributions and initialize seats for a bus
     */
    public void initializeSeatsIfNeeded(Bus bus) {
        try {
            // Check if bus has total seats defined
            if (bus.getTotalSeats() == null || bus.getTotalSeats() <= 0) {
                return;
            }
            
            int totalSeats = bus.getTotalSeats();
            
            // Calculate seats for each category
            int elderSeats = (totalSeats * elderSeatPercentage) / 100;
            int pregnantSeats = (totalSeats * pregnantSeatPercentage) / 100;
            int regularSeats = totalSeats - elderSeats - pregnantSeats;
            
            // Create a request DTO and initialize seats
            SeatInitRequestDTO initRequest = new SeatInitRequestDTO(
                bus.getId(),
                regularSeats,
                elderSeats,
                pregnantSeats
            );
            
            seatService.initializeSeatsForBus(
                initRequest.getBusId(),
                initRequest.getRegularSeats(),
                initRequest.getElderSeats(),
                initRequest.getPregnantSeats()
            );
        } catch (Exception e) {
            // Log error but don't fail application startup
            System.err.println("Error initializing seats for bus ID " + bus.getId() + ": " + e.getMessage());
        }
    }
} 