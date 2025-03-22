package BusManagementBooking.bus.seats;

import java.util.List;
import java.util.Map;

public interface SeatService {
    void initializeSeatsForBus(Long busId, int regularSeats, int elderSeats, int pregnantSeats);
    List<SeatDTO> getSeatsByBusId(Long busId);
    List<SeatDTO> getAvailableSeatsByBusId(Long busId);
    List<SeatDTO> getAvailableSeatsByTypeAndBusId(Long busId, String seatType);
    Map<String, Integer> getSeatCountByBusId(Long busId);
    SeatDTO updateSeatStatus(Long seatId, String status);
    void deleteSeatsForBus(Long busId);
} 