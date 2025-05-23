package com.abontrack.Subscription.Manager.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;

@Data
public class CategoryRequest {
    @NotBlank(message = "Name is required")
    private String name;
    
    private String description;
}