package com.abontrack.Subscription.Manager.service;

import com.abontrack.Subscription.Manager.model.PaymentFrequency;
import com.abontrack.Subscription.Manager.repository.PaymentFrequencyRepository;
import com.abontrack.Subscription.Manager.exception.ResourceNotFoundException;
import com.abontrack.Subscription.Manager.exception.DuplicateResourceException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentFrequencyService {

    private final PaymentFrequencyRepository paymentFrequencyRepository;

    public PaymentFrequencyService(PaymentFrequencyRepository paymentFrequencyRepository) {
        this.paymentFrequencyRepository = paymentFrequencyRepository;
    }

    @Transactional(readOnly = true)
    public List<PaymentFrequency> getAllPaymentFrequencies() {
        return paymentFrequencyRepository.findAllByOrderByMonthsIntervalAsc();
    }

    @Transactional(readOnly = true)
    public PaymentFrequency getPaymentFrequencyById(Long id) {
        return paymentFrequencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment frequency not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public PaymentFrequency getPaymentFrequencyByName(String name) {
        return paymentFrequencyRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Payment frequency not found with name: " + name));
    }

    @Transactional
    public PaymentFrequency createPaymentFrequency(PaymentFrequency paymentFrequency) {
        // Vérifier si une fréquence avec le même nom existe déjà
        Optional<PaymentFrequency> existingFrequency = paymentFrequencyRepository.findByName(paymentFrequency.getName());
        if (existingFrequency.isPresent()) {
            throw new DuplicateResourceException("Payment frequency with name '" + paymentFrequency.getName() + "' already exists");
        }
        
        return paymentFrequencyRepository.save(paymentFrequency);
    }

    @Transactional
    public PaymentFrequency updatePaymentFrequency(Long id, PaymentFrequency paymentFrequencyDetails) {
        PaymentFrequency paymentFrequency = getPaymentFrequencyById(id);
        
        // Vérifier si une fréquence différente avec le même nom existe déjà
        if (!paymentFrequency.getName().equals(paymentFrequencyDetails.getName())) {
            Optional<PaymentFrequency> existingFrequency = paymentFrequencyRepository.findByName(paymentFrequencyDetails.getName());
            if (existingFrequency.isPresent()) {
                throw new DuplicateResourceException("Payment frequency with name '" + paymentFrequencyDetails.getName() + "' already exists");
            }
        }
        
        paymentFrequency.setName(paymentFrequencyDetails.getName());
        paymentFrequency.setMonthsInterval(paymentFrequencyDetails.getMonthsInterval());
        paymentFrequency.setDescription(paymentFrequencyDetails.getDescription());
        
        return paymentFrequencyRepository.save(paymentFrequency);
    }

    @Transactional
    public void deletePaymentFrequency(Long id) {
        PaymentFrequency paymentFrequency = getPaymentFrequencyById(id);
        
        // Vérifier si la fréquence est utilisée par des abonnements
        if (!paymentFrequency.getSubscriptions().isEmpty()) {
            throw new IllegalStateException("Cannot delete payment frequency with active subscriptions");
        }
        
        paymentFrequencyRepository.delete(paymentFrequency);
    }
    
    @Transactional
    public void initDefaultPaymentFrequencies() {
        // Liste des fréquences de paiement par défaut à créer si elles n'existent pas
        Object[][] defaultFrequencies = {
            {"Mensuel", 1, "Paiement une fois par mois"},
            {"Trimestriel", 3, "Paiement tous les trois mois"},
            {"Semestriel", 6, "Paiement tous les six mois"},
            {"Annuel", 12, "Paiement une fois par an"},
            {"Biennal", 24, "Paiement tous les deux ans"}
        };
        
        for (Object[] frequencyData : defaultFrequencies) {
            String name = (String) frequencyData[0];
            Integer monthsInterval = (Integer) frequencyData[1];
            String description = (String) frequencyData[2];
            
            if (!paymentFrequencyRepository.findByName(name).isPresent()) {
                PaymentFrequency frequency = new PaymentFrequency(name, monthsInterval, description);
                paymentFrequencyRepository.save(frequency);
            }
        }
    }
}