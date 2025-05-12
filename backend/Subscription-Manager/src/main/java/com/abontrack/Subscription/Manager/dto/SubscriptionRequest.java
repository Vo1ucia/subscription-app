package com.abontrack.Subscription.Manager.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class SubscriptionRequest {
    @NotBlank(message = "Name is required")
    private String name;
    
    private String description;
    
    @NotNull(message = "Price is required")
    private BigDecimal price;
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    private Long categoryId; // Peut être null
    
    @NotNull(message = "Payment frequency ID is required")
    private Long paymentFrequencyId;
    
    @NotNull(message = "Start date is required")
    private LocalDate startDate;
    
    private LocalDate nextPaymentDate;
    
    private Boolean autoRenew = true;
    
    private Boolean active = true;
}