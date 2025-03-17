package BusManagementBooking.bus.buses;

import java.util.List;

public interface BusService {
    void addBus(BusAddRequestDTO busAddRequestDTO);
    List<Bus> getBuses();
    List<Bus> searchBuses(String name, String route, String departure, String arrival);
}
