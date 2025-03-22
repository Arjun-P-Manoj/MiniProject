package BusManagementBooking.bus.buses;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {
    List<Bus> findByNameContainingIgnoreCase(String name);
    List<Bus> findByRouteContainingIgnoreCase(String route);
    List<Bus> findByDepartureTimeContainingIgnoreCase(String departureTime);
    List<Bus> findByArrivalTimeContainingIgnoreCase(String arrivalTime);
    List<Bus> findByRouteContainingIgnoreCaseAndDepartureTimeContainingIgnoreCase(String route, String departureTime);
    List<Bus> findByRouteContainingIgnoreCaseAndArrivalTimeContainingIgnoreCase(String route, String arrivalTime);
    List<Bus> findByDepartureTimeContainingIgnoreCaseAndArrivalTimeContainingIgnoreCase(String departureTime, String arrivalTime);
    List<Bus> findByRouteContainingIgnoreCaseAndDepartureTimeContainingIgnoreCaseAndArrivalTimeContainingIgnoreCase(String route, String departureTime, String arrivalTime);
}
