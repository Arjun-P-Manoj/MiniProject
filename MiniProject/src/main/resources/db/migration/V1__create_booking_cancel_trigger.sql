-- Create a function to handle booking cancellation
CREATE OR REPLACE FUNCTION handle_booking_cancellation()
RETURNS TRIGGER AS $$
BEGIN
    -- Only proceed if the status is being changed to CANCELLED
    IF NEW.status = 'CANCELLED' AND OLD.status != 'CANCELLED' THEN
        -- Update the seat status to AVAILABLE
        UPDATE seats
        SET status = 'AVAILABLE'
        WHERE bus_id = NEW.bus_id
        AND seat_number = NEW.seat_number;

        -- Update the bus's available seats count
        UPDATE buses
        SET available_seats = available_seats + 1
        WHERE id = NEW.bus_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER booking_cancellation_trigger
    AFTER UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION handle_booking_cancellation(); 