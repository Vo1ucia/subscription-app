package com.abontrack.Subscription.Manager.service;

import com.abontrack.Subscription.Manager.model.Subscription;
import com.abontrack.Subscription.Manager.model.User;
import com.abontrack.Subscription.Manager.model.Category;
import com.abontrack.Subscription.Manager.model.PaymentFrequency;
import com.abontrack.Subscription.Manager.repository.SubscriptionRepository;
import com.abontrack.Subscription.Manager.repository.UserRepository;
import com.abontrack.Subscription.Manager.repository.CategoryRepository;
import com.abontrack.Subscription.Manager.repository.PaymentFrequencyRepository;
import com.abontrack.Subscription.Manager.exception.ResourceNotFoundException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PaymentFrequencyRepository paymentFrequencyRepository;

    public SubscriptionService(SubscriptionRepository subscriptionRepository,
                             UserRepository userRepository,
                             CategoryRepository categoryRepository,
                             PaymentFrequencyRepository paymentFrequencyRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.paymentFrequencyRepository = paymentFrequencyRepository;
    }

    @Transactional(readOnly = true)
    public List<Subscription> getAllSubscriptions() {
        return subscriptionRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Subscription> getActiveSubscriptionsByUserId(Long userId) {
        return subscriptionRepository.findByUserIdAndActiveTrue(userId);
    }

    @Transactional(readOnly = true)
    public Subscription getSubscriptionById(Long id) {
        return subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with id: " + id));
    }

    @Transactional
    public Subscription createSubscription(Subscription subscription, Long userId, Long categoryId, Long frequencyId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        Category category = null;
        if (categoryId != null) {
            category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
        }
        
        PaymentFrequency frequency = paymentFrequencyRepository.findById(frequencyId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment frequency not found with id: " + frequencyId));
        
        subscription.setUser(user);
        subscription.setCategory(category);
        subscription.setPaymentFrequency(frequency);
        
        // Si nextPaymentDate n'est pas défini, le calculer
        if (subscription.getNextPaymentDate() == null) {
            subscription.calculateNextPaymentDate();
        }
        
        return subscriptionRepository.save(subscription);
    }

    @Transactional
    public Subscription updateSubscription(Long id, Subscription subscriptionDetails, 
                                          Long categoryId, Long frequencyId) {
        Subscription subscription = getSubscriptionById(id);
        
        subscription.setName(subscriptionDetails.getName());
        subscription.setDescription(subscriptionDetails.getDescription());
        subscription.setPrice(subscriptionDetails.getPrice());
        subscription.setStartDate(subscriptionDetails.getStartDate());
        subscription.setAutoRenew(subscriptionDetails.getAutoRenew());
        subscription.setActive(subscriptionDetails.getActive());
        
        // Mise à jour de la catégorie si spécifiée
        if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
            subscription.setCategory(category);
        } else {
            subscription.setCategory(null);
        }
        
        // Mise à jour de la fréquence de paiement si spécifiée
        if (frequencyId != null) {
            PaymentFrequency frequency = paymentFrequencyRepository.findById(frequencyId)
                    .orElseThrow(() -> new ResourceNotFoundException("Payment frequency not found with id: " + frequencyId));
            subscription.setPaymentFrequency(frequency);
            
            // Recalculer la prochaine date de paiement si la fréquence a changé
            subscription.calculateNextPaymentDate();
        }
        
        return subscriptionRepository.save(subscription);
    }

    @Transactional
    public void deleteSubscription(Long id) {
        Subscription subscription = getSubscriptionById(id);
        subscriptionRepository.delete(subscription);
    }

    @Transactional
    public void deactivateSubscription(Long id) {
        Subscription subscription = getSubscriptionById(id);
        subscription.setActive(false);
        subscriptionRepository.save(subscription);
    }

    @Transactional
    public void activateSubscription(Long id) {
        Subscription subscription = getSubscriptionById(id);
        subscription.setActive(true);
        subscriptionRepository.save(subscription);
    }


    @Transactional(readOnly = true)
    public List<Subscription> getUpcomingPayments(Long userId, int daysAhead) {
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(daysAhead);
        
        return subscriptionRepository.findUpcomingPayments(today, endDate).stream()
                .filter(sub -> sub.getUser().getId().equals(userId))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BigDecimal calculateTotalMonthlyExpense(Long userId) {
        List<Subscription> activeSubscriptions = subscriptionRepository.findByUserIdAndActiveTrue(userId);
        
        return activeSubscriptions.stream()
                .map(Subscription::getMonthlyCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Transactional(readOnly = true)
    public List<Subscription> getSubscriptionsByCategory(Long userId, Long categoryId) {
        return subscriptionRepository.findByCategoryIdAndUserIdAndActiveTrue(categoryId, userId);
    }
}