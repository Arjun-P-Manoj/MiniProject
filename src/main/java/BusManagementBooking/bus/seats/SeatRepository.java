package BusManagementBooking.bus.seats;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByBusId(Long busId);
    List<Seat> findByBusIdAndSeatType(Long busId, Seat.SeatType seatType);
    List<Seat> findByBusIdAndStatus(Long busId, Seat.SeatStatus status);
    List<Seat> findByBusIdAndSeatTypeAndStatus(Long busId, Seat.SeatType seatType, Seat.SeatStatus status);
    int countByBusIdAndSeatType(Long busId, Seat.SeatType seatType);
} 