package BusManagementBooking.bus.booking;

import java.util.List;

public interface BookingService {
    void addBooking(BookingAddRequestDTO bookingAddRequestDTO);
    List<Booking> getBookings();
}
