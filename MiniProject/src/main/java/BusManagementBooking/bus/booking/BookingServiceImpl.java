package BusManagementBooking.bus.booking;

import BusManagementBooking.bus.buses.Bus;
import BusManagementBooking.bus.buses.BusRepository;
import BusManagementBooking.bus.seats.Seat;
import BusManagementBooking.bus.seats.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BookingServiceImpl implements BookingService {

    private static final Logger logger = LoggerFactory.getLogger(BookingServiceImpl.class);

    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private SeatRepository seatRepository;
    
    @Autowired
    private BusRepository busRepository;

    @Override
    @Transactional
    public Booking addBooking(BookingAddRequestDTO bookingAddRequestDTO) {
        // Validate required fields
        if (bookingAddRequestDTO.getBusId() == null) {
            throw new IllegalArgumentException("Bus ID cannot be null");
        }
        
        if (bookingAddRequestDTO.getUserId() == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        
        if (bookingAddRequestDTO.getSeatNumber() == null || bookingAddRequestDTO.getSeatNumber().isEmpty()) {
            throw new IllegalArgumentException("Seat number cannot be null or empty");
        }
        
        // Check if seat exists and is available
        Long busId = bookingAddRequestDTO.getBusId();
        String seatNumber = bookingAddRequestDTO.getSeatNumber();
        
        // Find the seat by bus ID and seat number
        List<Seat> matchingSeats = seatRepository.findByBusId(busId);
        Optional<Seat> seatOpt = matchingSeats.stream()
                .filter(s -> s.getSeatNumber().equals(seatNumber))
                .findFirst();
                
        if (seatOpt.isEmpty()) {
            throw new IllegalArgumentException("Seat " + seatNumber + " not found for bus ID " + busId);
        }
        
        Seat seat = seatOpt.get();
        if (seat.getStatus() == Seat.SeatStatus.BOOKED) {
            throw new IllegalArgumentException("Seat " + seatNumber + " is already booked");
        }
        
        // Update seat status to BOOKED
        seat.setStatus(Seat.SeatStatus.BOOKED);
        seatRepository.save(seat);
        
        // Update bus available seats
        Optional<Bus> busOpt = busRepository.findById(busId);
        if (busOpt.isPresent()) {
            Bus bus = busOpt.get();
            Integer availableSeats = bus.getAvailableSeats();
            if (availableSeats != null && availableSeats > 0) {
                bus.setAvailableSeats(availableSeats - 1);
                busRepository.save(bus);
            }
        }
        
        // Set current date time if bookingDate is null
        LocalDateTime bookingDate = bookingAddRequestDTO.getBookingDate();
        if (bookingDate == null) {
            bookingDate = LocalDateTime.now();
        }
        
        // Set default status if null
        String status = bookingAddRequestDTO.getStatus();
        if (status == null || status.isEmpty()) {
            status = "CONFIRMED";
        }
        
        // Set default amount if null
        BigDecimal amount = bookingAddRequestDTO.getAmount();
        if (amount == null) {
            // Get amount from bus if available
            if (busOpt.isPresent()) {
                amount = busOpt.get().getPrice();
            } else {
                amount = BigDecimal.ZERO;
            }
        }
        
        Booking booking = new Booking(
                bookingAddRequestDTO.getUserId(),
                bookingAddRequestDTO.getBusId(),
                bookingDate,
                bookingAddRequestDTO.getSeatNumber(),
                amount,
                status
        );
        return bookingRepository.save(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Booking> getBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        logger.info("Found {} total bookings", bookings.size());
        
        for (Booking booking : bookings) {
            Optional<Bus> busOpt = busRepository.findById(booking.getBusId());
            if (busOpt.isPresent()) {
                Bus bus = busOpt.get();
                booking.setBus(bus);
                logger.info("Added bus details for booking {}: name={}, route={}, departure={}, arrival={}", 
                    booking.getId(), bus.getName(), bus.getRoute(), bus.getDepartureTime(), bus.getArrivalTime());
            } else {
                logger.warn("Bus not found for booking ID: {}", booking.getId());
            }
        }
        return bookings;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Booking> getBookingsByUserId(Long userId) {
        List<Booking> bookings = bookingRepository.findByUserId(userId);
        logger.info("Found {} bookings for user ID: {}", bookings.size(), userId);
        
        for (Booking booking : bookings) {
            try {
                // Get bus ID from the booking
                Long busId = booking.getBusId();
                logger.info("Fetching bus data for booking {} with bus ID: {}", booking.getId(), busId);
                
                if (busId != null) {
                    // Fetch the complete bus object with all fields
                    Optional<Bus> busOpt = busRepository.findById(busId);
                    if (busOpt.isPresent()) {
                        Bus bus = busOpt.get();
                        // Set all bus fields explicitly
                        Bus completeBus = new Bus();
                        completeBus.setId(bus.getId());
                        completeBus.setName(bus.getName());
                        completeBus.setRoute(bus.getRoute());
                        completeBus.setDepartureTime(bus.getDepartureTime());
                        completeBus.setArrivalTime(bus.getArrivalTime());
                        completeBus.setAvailableSeats(bus.getAvailableSeats());
                        completeBus.setTotalSeats(bus.getTotalSeats());
                        completeBus.setPrice(bus.getPrice());
                        
                        booking.setBus(completeBus);
                        logger.info("Successfully added bus data for booking {}: name={}, route={}, departure={}, arrival={}", 
                            booking.getId(), bus.getName(), bus.getRoute(), bus.getDepartureTime(), bus.getArrivalTime());
                    } else {
                        logger.error("Bus not found for ID: {}", busId);
                    }
                } else {
                    logger.error("Booking {} has no bus ID", booking.getId());
                }
            } catch (Exception e) {
                logger.error("Error fetching bus data for booking {}: {}", booking.getId(), e.getMessage());
            }
        }
        return bookings;
    }
    
    @Override
    @Transactional
    public boolean cancelBooking(Long bookingId) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isEmpty()) {
            return false;
        }
        
        Booking booking = bookingOpt.get();
        
        // Update booking status
        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
        
        // Find the seat and mark it as available again
        String seatNumber = booking.getSeatNumber();
        Long busId = booking.getBusId();
        
        List<Seat> matchingSeats = seatRepository.findByBusId(busId);
        Optional<Seat> seatOpt = matchingSeats.stream()
                .filter(s -> s.getSeatNumber().equals(seatNumber))
                .findFirst();
                
        if (seatOpt.isPresent()) {
            Seat seat = seatOpt.get();
            seat.setStatus(Seat.SeatStatus.AVAILABLE);
            seatRepository.save(seat);
            
            // Update bus available seats
            Optional<Bus> busOpt = busRepository.findById(busId);
            if (busOpt.isPresent()) {
                Bus bus = busOpt.get();
                Integer availableSeats = bus.getAvailableSeats();
                if (availableSeats != null) {
                    bus.setAvailableSeats(availableSeats + 1);
                    busRepository.save(bus);
                }
            }
        }
        
        return true;
    }
}
