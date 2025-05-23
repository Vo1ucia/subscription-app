package com.abontrack.Subscription.Manager.dto;

import lombok.Data;

@Data
public class PaymentFrequencyDTO {
    private Long id;
    private String name;
    private Integer monthsInterval;
    private String description;
    private int subscriptionCount;
}