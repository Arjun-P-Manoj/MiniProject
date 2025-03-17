package BusManagementBooking.bus.buses;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;

@Service
public class BusServiceImpl implements BusService {

    private final BusRepository busRepository;

    @Autowired
    public BusServiceImpl(BusRepository busRepository) {
        this.busRepository = busRepository;
    }

    @Override
    public void addBus(BusAddRequestDTO busAddRequestDTO) {
        Bus bus = new Bus(
                busAddRequestDTO.getName(),
                busAddRequestDTO.getRoute(),
                busAddRequestDTO.getDepartureTime(),
                busAddRequestDTO.getArrivalTime(),
                busAddRequestDTO.getAvailableSeats(),
                busAddRequestDTO.getTotalSeats(),
                BigDecimal.valueOf(busAddRequestDTO.getPrice())
        );

        busRepository.save(bus);
    }

    @Override
    public List<Bus> getBuses() {
        return busRepository.findAll();
    }
}
