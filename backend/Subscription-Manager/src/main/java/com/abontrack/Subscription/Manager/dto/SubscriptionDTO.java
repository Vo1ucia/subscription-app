package com.abontrack.Subscription.Manager.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class SubscriptionDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Long userId;
    private Long categoryId;
    private String categoryName;
    private Long paymentFrequencyId;
    private String paymentFrequencyName;
    private Integer monthsInterval;
    private LocalDate startDate;
    private LocalDate nextPaymentDate;
    private Boolean autoRenew;
    private Boolean active;
    private BigDecimal monthlyCost;
}