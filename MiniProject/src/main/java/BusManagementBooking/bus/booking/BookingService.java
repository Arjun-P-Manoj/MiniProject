package BusManagementBooking.bus.booking;

import java.util.List;

public interface BookingService {
    Booking addBooking(BookingAddRequestDTO bookingAddRequestDTO);
    List<Booking> getBookings();
    List<Booking> getBookingsByUserId(Long userId);
    boolean cancelBooking(Long bookingId);
    void transferSeat(Long bookingId, Long newBusId, Long newSeatId) throws Exception;
}
