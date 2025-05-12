package com.abontrack.Subscription.Manager.controller;

import com.abontrack.Subscription.Manager.model.PaymentFrequency;
import com.abontrack.Subscription.Manager.service.PaymentFrequencyService;
import com.abontrack.Subscription.Manager.dto.PaymentFrequencyDTO;
import com.abontrack.Subscription.Manager.dto.PaymentFrequencyRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payment-frequencies")
@CrossOrigin(origins = "*") // Ou configurez selon vos besoins de CORS
public class PaymentFrequencyController {

    private final PaymentFrequencyService paymentFrequencyService;

    public PaymentFrequencyController(PaymentFrequencyService paymentFrequencyService) {
        this.paymentFrequencyService = paymentFrequencyService;
    }

    
    @PostMapping("/actions/init")
    public ResponseEntity<Void> initDefaultPaymentFrequencies() {
        paymentFrequencyService.initDefaultPaymentFrequencies();
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<PaymentFrequencyDTO>> getAllPaymentFrequencies() {
        List<PaymentFrequency> frequencies = paymentFrequencyService.getAllPaymentFrequencies();
        List<PaymentFrequencyDTO> frequencyDTOs = frequencies.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(frequencyDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentFrequencyDTO> getPaymentFrequencyById(@PathVariable Long id) {
        PaymentFrequency frequency = paymentFrequencyService.getPaymentFrequencyById(id);
        return ResponseEntity.ok(convertToDTO(frequency));
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<PaymentFrequencyDTO> getPaymentFrequencyByName(@PathVariable String name) {
        PaymentFrequency frequency = paymentFrequencyService.getPaymentFrequencyByName(name);
        return ResponseEntity.ok(convertToDTO(frequency));
    }

    @PostMapping
    public ResponseEntity<PaymentFrequencyDTO> createPaymentFrequency(@Valid @RequestBody PaymentFrequencyRequest request) {
        PaymentFrequency frequency = convertToEntity(request);
        PaymentFrequency createdFrequency = paymentFrequencyService.createPaymentFrequency(frequency);
        return new ResponseEntity<>(convertToDTO(createdFrequency), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentFrequencyDTO> updatePaymentFrequency(
            @PathVariable Long id, 
            @Valid @RequestBody PaymentFrequencyRequest request) {
        PaymentFrequency frequency = convertToEntity(request);
        PaymentFrequency updatedFrequency = paymentFrequencyService.updatePaymentFrequency(id, frequency);
        return ResponseEntity.ok(convertToDTO(updatedFrequency));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePaymentFrequency(@PathVariable Long id) {
        try {
            paymentFrequencyService.deletePaymentFrequency(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }


    // Méthode utilitaire pour convertir une entité en DTO
    private PaymentFrequencyDTO convertToDTO(PaymentFrequency frequency) {
        PaymentFrequencyDTO dto = new PaymentFrequencyDTO();
        dto.setId(frequency.getId());
        dto.setName(frequency.getName());
        dto.setMonthsInterval(frequency.getMonthsInterval());
        dto.setDescription(frequency.getDescription());
        dto.setSubscriptionCount(frequency.getSubscriptions().size());
        return dto;
    }

    // Méthode utilitaire pour convertir une requête en entité
    private PaymentFrequency convertToEntity(PaymentFrequencyRequest request) {
        PaymentFrequency frequency = new PaymentFrequency();
        frequency.setName(request.getName());
        frequency.setMonthsInterval(request.getMonthsInterval());
        frequency.setDescription(request.getDescription());
        return frequency;
    }
}