package BusManagementBooking.bus.user;

public class UserPriorityInfoDTO {
    private Long userId;
    private boolean elderlyPriorityEligible;
    private boolean pregnantPriorityEligible;
    private String recommendedSeatType;

    public UserPriorityInfoDTO() {
    }

    public UserPriorityInfoDTO(User user) {
        this.userId = user.getId();
        this.elderlyPriorityEligible = user.isElderlyPriorityEligible();
        this.pregnantPriorityEligible = user.isPregnantPriorityEligible();
        
        // Determine recommended seat type based on user attributes
        if (user.isPregnantPriorityEligible()) {
            this.recommendedSeatType = "PREGNANT";
        } else if (user.isElderlyPriorityEligible()) {
            this.recommendedSeatType = "ELDER";
        } else {
            this.recommendedSeatType = "REGULAR";
        }
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public boolean isElderlyPriorityEligible() {
        return elderlyPriorityEligible;
    }

    public void setElderlyPriorityEligible(boolean elderlyPriorityEligible) {
        this.elderlyPriorityEligible = elderlyPriorityEligible;
    }

    public boolean isPregnantPriorityEligible() {
        return pregnantPriorityEligible;
    }

    public void setPregnantPriorityEligible(boolean pregnantPriorityEligible) {
        this.pregnantPriorityEligible = pregnantPriorityEligible;
    }

    public String getRecommendedSeatType() {
        return recommendedSeatType;
    }

    public void setRecommendedSeatType(String recommendedSeatType) {
        this.recommendedSeatType = recommendedSeatType;
    }
} 