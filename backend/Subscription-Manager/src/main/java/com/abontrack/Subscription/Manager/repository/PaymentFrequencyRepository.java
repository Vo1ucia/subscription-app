package com.abontrack.Subscription.Manager.repository;

import com.abontrack.Subscription.Manager.model.PaymentFrequency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface PaymentFrequencyRepository extends JpaRepository<PaymentFrequency, Long> {
    
    Optional<PaymentFrequency> findByName(String name);
    
    List<PaymentFrequency> findAllByOrderByMonthsIntervalAsc();
}