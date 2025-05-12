package com.abontrack.Subscription.Manager.dto;
import lombok.Data;

@Data
public class CategoryDTO {
    private Long id;
    private String name;
    private String description;
    private int subscriptionCount;
}