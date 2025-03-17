package BusManagementBooking.bus.seats;

import BusManagementBooking.bus.buses.Bus;
import BusManagementBooking.bus.buses.BusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SeatServiceImpl implements SeatService {

    @Autowired
    private SeatRepository seatRepository;
    
    @Autowired
    private BusRepository busRepository;
    
    @Override
    @Transactional
    public void initializeSeatsForBus(Long busId, int regularSeats, int elderSeats, int pregnantSeats) {
        Bus bus = busRepository.findById(busId)
            .orElseThrow(() -> new RuntimeException("Bus not found with ID: " + busId));
        
        int totalSeatsToCreate = regularSeats + elderSeats + pregnantSeats;
        if (totalSeatsToCreate != bus.getTotalSeats()) {
            throw new RuntimeException("Total seats count doesn't match bus total seats");
        }
        
        // Clear any existing seats for this bus
        List<Seat> existingSeats = seatRepository.findByBusId(busId);
        if (!existingSeats.isEmpty()) {
            seatRepository.deleteAll(existingSeats);
        }
        
        // Create and save regular seats
        for (int i = 1; i <= regularSeats; i++) {
            Seat seat = new Seat(
                "R" + String.format("%02d", i),
                Seat.SeatType.REGULAR,
                Seat.SeatStatus.AVAILABLE,
                bus
            );
            seatRepository.save(seat);
        }
        
        // Create and save elder seats
        for (int i = 1; i <= elderSeats; i++) {
            Seat seat = new Seat(
                "E" + String.format("%02d", i),
                Seat.SeatType.ELDER,
                Seat.SeatStatus.AVAILABLE,
                bus
            );
            seatRepository.save(seat);
        }
        
        // Create and save pregnant women seats
        for (int i = 1; i <= pregnantSeats; i++) {
            Seat seat = new Seat(
                "P" + String.format("%02d", i),
                Seat.SeatType.PREGNANT,
                Seat.SeatStatus.AVAILABLE,
                bus
            );
            seatRepository.save(seat);
        }
    }
    
    @Override
    @Transactional
    public List<SeatDTO> getSeatsByBusId(Long busId) {
        return seatRepository.findByBusId(busId).stream()
            .map(seat -> {
                // Ensure busId is set correctly
                SeatDTO dto = SeatDTO.fromEntity(seat);
                if (dto.getBusId() == null) {
                    dto.setBusId(busId);
                }
                return dto;
            })
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public List<SeatDTO> getAvailableSeatsByBusId(Long busId) {
        return seatRepository.findByBusIdAndStatus(busId, Seat.SeatStatus.AVAILABLE).stream()
            .map(seat -> {
                // Ensure busId is set correctly
                SeatDTO dto = SeatDTO.fromEntity(seat);
                if (dto.getBusId() == null) {
                    dto.setBusId(busId);
                }
                return dto;
            })
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public List<SeatDTO> getAvailableSeatsByTypeAndBusId(Long busId, String seatType) {
        try {
            Seat.SeatType type = Seat.SeatType.valueOf(seatType);
            return seatRepository.findByBusIdAndSeatTypeAndStatus(busId, type, Seat.SeatStatus.AVAILABLE).stream()
                .map(seat -> {
                    // Ensure busId is set correctly
                    SeatDTO dto = SeatDTO.fromEntity(seat);
                    if (dto.getBusId() == null) {
                        dto.setBusId(busId);
                    }
                    return dto;
                })
                .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid seat type: " + seatType + ". Valid types are: REGULAR, ELDER, PREGNANT");
        }
    }
    
    @Override
    public Map<String, Integer> getSeatCountByBusId(Long busId) {
        Map<String, Integer> seatCounts = new HashMap<>();
        seatCounts.put("REGULAR", seatRepository.countByBusIdAndSeatType(busId, Seat.SeatType.REGULAR));
        seatCounts.put("ELDER", seatRepository.countByBusIdAndSeatType(busId, Seat.SeatType.ELDER));
        seatCounts.put("PREGNANT", seatRepository.countByBusIdAndSeatType(busId, Seat.SeatType.PREGNANT));
        return seatCounts;
    }
    
    @Override
    @Transactional
    public SeatDTO updateSeatStatus(Long seatId, String status) {
        try {
            Seat.SeatStatus seatStatus = Seat.SeatStatus.valueOf(status);
            Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new RuntimeException("Seat not found with ID: " + seatId));
            
            seat.setStatus(seatStatus);
            seat = seatRepository.save(seat);
            
            // Ensure busId is set correctly
            SeatDTO dto = SeatDTO.fromEntity(seat);
            if (dto.getBusId() == null && seat.getBus() != null) {
                dto.setBusId(seat.getBus().getId());
            }
            return dto;
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid seat status: " + status + ". Valid statuses are: AVAILABLE, BOOKED");
        }
    }
    
    @Override
    @Transactional
    public void deleteSeatsForBus(Long busId) {
        List<Seat> seats = seatRepository.findByBusId(busId);
        seatRepository.deleteAll(seats);
    }
} 