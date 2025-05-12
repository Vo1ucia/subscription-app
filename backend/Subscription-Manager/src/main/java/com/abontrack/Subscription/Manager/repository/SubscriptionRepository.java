package com.abontrack.Subscription.Manager.repository;

import com.abontrack.Subscription.Manager.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.math.BigDecimal;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    
    List<Subscription> findByUserIdAndActiveTrue(Long userId);
    
    @Query("SELECT s FROM Subscription s WHERE s.nextPaymentDate BETWEEN :start AND :end AND s.active = true")
    List<Subscription> findUpcomingPayments(LocalDate start, LocalDate end);
    
    List<Subscription> findByCategoryIdAndUserIdAndActiveTrue(Long categoryId, Long userId);
    
    @Query("SELECT SUM(s.price) FROM Subscription s WHERE s.user.id = :userId AND s.active = true")
    BigDecimal calculateTotalSubscriptionCost(Long userId);
}