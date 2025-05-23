package com.abontrack.Subscription.Manager.config;

import com.abontrack.Subscription.Manager.service.CategoryService;
import com.abontrack.Subscription.Manager.service.PaymentFrequencyService;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer {

    private final CategoryService categoryService;
    private final PaymentFrequencyService paymentFrequencyService;

    public DataInitializer(CategoryService categoryService, PaymentFrequencyService paymentFrequencyService) {
        this.categoryService = categoryService;
        this.paymentFrequencyService = paymentFrequencyService;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void initializeData() {
        categoryService.initDefaultCategories();
        paymentFrequencyService.initDefaultPaymentFrequencies();
    }
}