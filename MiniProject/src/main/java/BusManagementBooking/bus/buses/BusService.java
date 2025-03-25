package BusManagementBooking.bus.buses;

import java.util.List;
import java.util.Optional;

public interface BusService {
    Bus addBus(BusAddRequestDTO busAddRequestDTO);
    List<Bus> getBuses();
    Optional<Bus> getBusById(Long busId);
    List<Bus> searchBuses(String name, String route, String departure, String arrival);
    void deleteBus(Long busId);
    Bus updateBus(Long busId, BusAddRequestDTO busUpdateRequestDTO);
}
