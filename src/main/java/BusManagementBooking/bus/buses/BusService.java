package BusManagementBooking.bus.buses;

import java.util.List;

public interface BusService {
    void addBus(BusAddRequestDTO busAddRequestDTO);
    List<Bus> getBuses();
}
