package com.abontrack.Subscription.Manager.dto;


import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    // Pas de mot de passe
}