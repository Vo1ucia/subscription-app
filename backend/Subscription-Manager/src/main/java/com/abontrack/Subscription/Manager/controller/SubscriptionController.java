package com.abontrack.Subscription.Manager.controller;

import com.abontrack.Subscription.Manager.model.PaymentFrequency;
import com.abontrack.Subscription.Manager.model.Subscription;
import com.abontrack.Subscription.Manager.service.SubscriptionService;

import jakarta.validation.Valid;

import com.abontrack.Subscription.Manager.dto.SubscriptionDTO;
import com.abontrack.Subscription.Manager.dto.SubscriptionRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/subscriptions")
@CrossOrigin(origins = "*") // Ou configurez selon vos besoins de CORS
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @GetMapping
    public ResponseEntity<List<SubscriptionDTO>> getAllSubscriptions() {
        List<Subscription> subscriptions = subscriptionService.getAllSubscriptions();
        List<SubscriptionDTO> subscriptionDTOs = subscriptions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(subscriptionDTOs);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SubscriptionDTO>> getActiveSubscriptionsByUserId(@PathVariable Long userId) {
        List<Subscription> subscriptions = subscriptionService.getActiveSubscriptionsByUserId(userId);
        List<SubscriptionDTO> subscriptionDTOs = subscriptions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(subscriptionDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionDTO> getSubscriptionById(@PathVariable Long id) {
        Subscription subscription = subscriptionService.getSubscriptionById(id);
        return ResponseEntity.ok(convertToDTO(subscription));
    }

    @PostMapping
    public ResponseEntity<SubscriptionDTO> createSubscription(@Valid @RequestBody SubscriptionRequest request) {
        Subscription subscription = convertToEntity(request);
        Subscription createdSubscription = subscriptionService.createSubscription(
                subscription, request.getUserId(), request.getCategoryId(), request.getPaymentFrequencyId());
        return new ResponseEntity<>(convertToDTO(createdSubscription), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubscriptionDTO> updateSubscription(
            @PathVariable Long id, 
            @Valid @RequestBody SubscriptionRequest request) {
        Subscription subscription = convertToEntity(request);
        Subscription updatedSubscription = subscriptionService.updateSubscription(
                id, subscription, request.getCategoryId(), request.getPaymentFrequencyId());
        return ResponseEntity.ok(convertToDTO(updatedSubscription));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubscription(@PathVariable Long id) {
        subscriptionService.deleteSubscription(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateSubscription(@PathVariable Long id) {
        subscriptionService.deactivateSubscription(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<Void> activateSubscription(@PathVariable Long id) {
        subscriptionService.activateSubscription(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}/upcoming")
    public ResponseEntity<List<SubscriptionDTO>> getUpcomingPayments(
            @PathVariable Long userId, 
            @RequestParam(defaultValue = "30") int daysAhead) {
        List<Subscription> subscriptions = subscriptionService.getUpcomingPayments(userId, daysAhead);
        List<SubscriptionDTO> subscriptionDTOs = subscriptions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(subscriptionDTOs);
    }

    @GetMapping("/user/{userId}/monthly-expense")
    public ResponseEntity<BigDecimal> calculateTotalMonthlyExpense(@PathVariable Long userId) {
        BigDecimal totalMonthlyExpense = subscriptionService.calculateTotalMonthlyExpense(userId);
        return ResponseEntity.ok(totalMonthlyExpense);
    }

    @GetMapping("/user/{userId}/category/{categoryId}")
    public ResponseEntity<List<SubscriptionDTO>> getSubscriptionsByCategory(
            @PathVariable Long userId, 
            @PathVariable Long categoryId) {
        List<Subscription> subscriptions = subscriptionService.getSubscriptionsByCategory(userId, categoryId);
        List<SubscriptionDTO> subscriptionDTOs = subscriptions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(subscriptionDTOs);
    }

    // Méthode utilitaire pour convertir une entité en DTO
    private SubscriptionDTO convertToDTO(Subscription subscription) {
        SubscriptionDTO dto = new SubscriptionDTO();
        dto.setId(subscription.getId());
        dto.setName(subscription.getName());
        dto.setDescription(subscription.getDescription());
        dto.setPrice(subscription.getPrice());
        
        if (subscription.getCategory() != null) {
            dto.setCategoryId(subscription.getCategory().getId());
            dto.setCategoryName(subscription.getCategory().getName());
        }
        
        
        dto.setPaymentFrequencyId(subscription.getPaymentFrequency().getId());
        dto.setPaymentFrequencyName(subscription.getPaymentFrequency().getName());
        dto.setMonthsInterval(subscription.getPaymentFrequency().getMonthsInterval());
        
        dto.setStartDate(subscription.getStartDate());
        dto.setNextPaymentDate(subscription.getNextPaymentDate());
        dto.setAutoRenew(subscription.getAutoRenew());
        dto.setActive(subscription.getActive());
        dto.setMonthlyCost(subscription.getMonthlyCost());
        dto.setUserId(subscription.getUser().getId());
        
        return dto;
    }

    // Méthode utilitaire pour convertir une requête en entité
    private Subscription convertToEntity(SubscriptionRequest request) {
        Subscription subscription = new Subscription();
        subscription.setName(request.getName());
        subscription.setDescription(request.getDescription());
        subscription.setPrice(request.getPrice());
        subscription.setStartDate(request.getStartDate());
        subscription.setNextPaymentDate(request.getNextPaymentDate());
        subscription.setAutoRenew(request.getAutoRenew());
        subscription.setActive(request.getActive() != null ? request.getActive() : true);
        
        return subscription;
    }
}