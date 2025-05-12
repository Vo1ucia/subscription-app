package com.abontrack.Subscription.Manager.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.math.RoundingMode;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "payment_frequencies")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentFrequency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(name = "months_interval", nullable = false)
    private Integer monthsInterval;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "paymentFrequency")
    private List<Subscription> subscriptions = new ArrayList<>();
    
    // Constructeur pratique pour l'initialisation des données
    public PaymentFrequency(String name, Integer monthsInterval, String description) {
        this.name = name;
        this.monthsInterval = monthsInterval;
        this.description = description;
    }
    
    // Méthode utilitaire pour calculer le coût mensuel d'un abonnement
    public BigDecimal calculateMonthlyCost(BigDecimal price) {
        if (monthsInterval == 0) {
            return BigDecimal.ZERO; // Pour éviter division par zéro
        }
        return price.divide(new BigDecimal(monthsInterval), 2, RoundingMode.HALF_UP);
    }
}