package BusManagementBooking.bus.booking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public void addBooking(BookingAddRequestDTO bookingAddRequestDTO) {
        // Validate required fields
        if (bookingAddRequestDTO.getBusId() == null) {
            throw new IllegalArgumentException("Bus ID cannot be null");
        }
        
        if (bookingAddRequestDTO.getUserId() == null) {
            throw new IllegalArgumentException("User ID cannot be null");
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
            amount = BigDecimal.ZERO;
        }
        
        Booking booking = new Booking(
                bookingAddRequestDTO.getUserId(),
                bookingAddRequestDTO.getBusId(),
                bookingDate,
                bookingAddRequestDTO.getSeatNumber(),
                amount,
                status
        );
        bookingRepository.save(booking);
    }

    @Override
    public List<Booking> getBookings() {
        return bookingRepository.findAll();
    }
}
