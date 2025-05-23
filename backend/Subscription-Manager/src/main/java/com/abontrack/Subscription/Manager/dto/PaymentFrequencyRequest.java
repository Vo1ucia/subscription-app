package com.abontrack.Subscription.Manager.dto;

import lombok.Data;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class PaymentFrequencyRequest {
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotNull(message = "Months interval is required")
    @Min(value = 1, message = "Months interval must be at least 1")
    private Integer monthsInterval;
    
    private String description;
}