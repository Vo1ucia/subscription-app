package com.abontrack.Subscription.Manager.model;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@Entity
@Table(name="subscriptions")
@NoArgsConstructor
@AllArgsConstructor
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String name;

    @Column
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "payment_frequency_id", nullable = false)
    private PaymentFrequency paymentFrequency;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "next_payment_date", nullable = false)
    private LocalDate nextPaymentDate;

    @Column(name = "auto_renew")
    private Boolean autoRenew = true;

    @Column
    private Boolean active = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

     // Méthode utilitaire pour calculer le coût mensuel
    @Transient // Cette propriété n'est pas persistée en base
    public BigDecimal getMonthlyCost() {
        if (paymentFrequency == null || paymentFrequency.getMonthsInterval() == 0) {
            return BigDecimal.ZERO;
        }
        return price.divide(new BigDecimal(paymentFrequency.getMonthsInterval()), 2, RoundingMode.HALF_UP);
    }
    
    // Méthode utilitaire pour calculer la prochaine date de paiement
    public void calculateNextPaymentDate() {
        if (paymentFrequency != null && startDate != null) {
            // Si la date de prochain paiement est dans le passé, on la met à jour
            LocalDate today = LocalDate.now();
            if (nextPaymentDate == null || nextPaymentDate.isBefore(today)) {
                // Calcul basé sur la date de début et l'intervalle de paiement
                LocalDate baseDate = (nextPaymentDate != null) ? nextPaymentDate : startDate;
                int monthsToAdd = paymentFrequency.getMonthsInterval();
                
                // Boucle jusqu'à obtenir une date future
                while (baseDate.isBefore(today) || baseDate.isEqual(today)) {
                    baseDate = baseDate.plusMonths(monthsToAdd);
                }
                
                nextPaymentDate = baseDate;
            }
        }
    }
    
    // Constructeur pratique
    public Subscription(User user, String name, BigDecimal price, 
                       PaymentFrequency paymentFrequency, LocalDate startDate) {
        this.user = user;
        this.name = name;
        this.price = price;
        this.paymentFrequency = paymentFrequency;
        this.startDate = startDate;
        this.nextPaymentDate = startDate.plusMonths(paymentFrequency.getMonthsInterval());
        this.active = true;
        this.autoRenew = true;
    }
}
