import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from '../../../core/models/subscription';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { CategoryService } from '../../../core/services/category.service';
import { PaymentFrequencyService } from '../../../core/services/paymentfrequency.service';

@Component({
  selector: 'app-subscription-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './subscription-form.component.html',
  styleUrl: './subscription-form.component.scss'
})
export class SubscriptionFormComponent implements OnInit{
  
  @Input() subscription: Subscription | null = null;
  @Output() cancel = new EventEmitter<void>();
  @Output() subscriptionAdded = new EventEmitter<void>();
  @Output() subscriptionUpdated = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private subscriptionService = inject(SubscriptionService);
  public categoryService = inject(CategoryService);
  public paymentFrequencyService = inject(PaymentFrequencyService);

  subscriptionForm = this.fb.group({
    name: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    paymentFrequency: [null as number | null, Validators.required],
    category: [null as number | null, Validators.required],
    startDate: ['', Validators.required],
    nextPaymentDate: [null as string | null],
    active: [true],
    description: ['']
  });

  submitted = false;
  isEditMode = false;
  isSubmitting = false;

  ngOnInit(): void {
    // Charger les listes de catégories et fréquences
    if (this.categoryService.categories().length === 0) {
      this.categoryService.loadAll();
    }
    
    if (this.paymentFrequencyService.frequencies().length === 0) {
      this.paymentFrequencyService.loadAll();
    }
    
    // Déterminer si on est en mode édition
    this.isEditMode = !!this.subscription;
    
    // Initialiser le formulaire avec les valeurs de l'abonnement si en mode édition
    if (this.subscription) {
      this.patchFormValues();
    }
  }
  
  private patchFormValues(): void {
    if (!this.subscription) return;
    
    this.subscriptionForm.patchValue({
      name: this.subscription.name,
      price: this.subscription.price,
      paymentFrequency: this.getPaymentFrequencyId(),
      category: this.getCategoryId(),
      startDate: this.formatDateForInput(this.subscription.startDate),
      nextPaymentDate: this.formatDateForInput(this.subscription.nextPaymentDate),
      active: this.subscription.active ?? true,
      description: this.subscription.description || ''
    });
  }
  
  private getPaymentFrequencyId(): number | null {
    if (!this.subscription?.paymentFrequency) return null;
    
    if (typeof this.subscription.paymentFrequency === 'number') {
      return this.subscription.paymentFrequency;
    } else if (this.subscription.paymentFrequency && 'id' in this.subscription.paymentFrequency) {
      return this.subscription.paymentFrequency.id || null;
    }
    
    return null;
  }
  
  private getCategoryId(): number | null {
    if (!this.subscription?.category) return null;
    
    if (typeof this.subscription.category === 'number') {
      return this.subscription.category;
    } else if (this.subscription.category && 'id' in this.subscription.category) {
      return this.subscription.category.id || null;
    }
    
    return null;
  }
  
  private formatDateForInput(date: Date | string | undefined): string {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString().split('T')[0];
  }
  
  onSubmit(): void {
    this.submitted = true;
    
    if (this.subscriptionForm.invalid) {
      return;
    }
    
    this.isSubmitting = true;
    
    const formData = this.prepareFormData();
    
    if (this.isEditMode && this.subscription?.id) {
      // Mise à jour d'un abonnement existant
      this.subscriptionService.update(this.subscription.id, formData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.subscriptionUpdated.emit();
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour:', error);
          this.isSubmitting = false;
        }
      });
    } else {
      // Création d'un nouvel abonnement
      this.subscriptionService.create(formData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.subscriptionUpdated.emit();
        },
        error: (error) => {
          console.error('Erreur lors de la création:', error);
          this.isSubmitting = false;
        }
      });
    }
  }
  
  private prepareFormData(): Subscription {
    const formValue = this.subscriptionForm.value;
    
    // Convertir les dates de chaînes en objets Date
    const startDate = formValue.startDate ? new Date(formValue.startDate) : new Date();
    const endDate = formValue.nextPaymentDate ? new Date(formValue.nextPaymentDate) : undefined;
    
    return {
      ...(this.subscription || {}),  // Préserver l'ID et d'autres champs si en mode édition
      name: formValue.name || '',
      price: parseFloat(formValue.price?.toString() || '0'),
      paymentFrequency: formValue.paymentFrequency || null,
      category: formValue.category || null,
      startDate: startDate,
      nextPaymentDate: endDate,
      active: formValue.active ?? true,
      description: formValue.description || ''
    } as Subscription;
  }
  
  onCancel(): void {
    this.cancel.emit();
  }
}
