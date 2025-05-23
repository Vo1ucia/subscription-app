import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from '../../../core/models/subscription';
import { CategoryService } from '../../../core/services/category.service';
import { PaymentFrequencyService } from '../../../core/services/paymentfrequency.service';


@Component({
  selector: 'app-subscription-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription-card.component.html',
  styleUrl: './subscription-card.component.scss'
})

export class SubscriptionCardComponent {
  @Input() subscription!: Subscription;
  @Output() delete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<Subscription>();

  showDetails = false;

  private categoryService = inject(CategoryService);
  private paymentFrequencyService = inject(PaymentFrequencyService);
  
  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }
  
  onDeleteClick(): void {
    if (this.subscription.id) {
      this.delete.emit(this.subscription.id);
    }
  }

  onEditClick(): void{
    this.edit.emit(this.subscription);
  }

  getMonthlyPrice(): number {
    const amount = this.subscription.price || 0;
    const frequency = this.getPaymentFrequency();
    
    if (!frequency || !frequency.months) {
      return amount; // Par défaut considéré comme mensuel
    }
    
    return amount / frequency.months;
  }

   formatOriginalPrice(): string {
    const amount = this.subscription.price || 0;
    const frequency = this.getPaymentFrequency();
    
    if (!frequency || !frequency.name) {
      return `${amount.toFixed(2)}€`;
    }
    
    return `${amount.toFixed(2)}€/${frequency.name}`;
  }
  
  getCategoryName(): string {
    console.log(this.subscription);
    if (typeof this.subscription.category === 'object' && this.subscription.category) {
      return this.subscription.category.name;
    } else if (typeof this.subscription.category === 'number') {
      const category = this.categoryService.categories()
        .find(c => c.id === this.subscription.category);
      return category?.name || 'Non catégorisé';
    }
    
    return 'Non catégorisé';
  }
  
  getFrequencyName(): string {
    const frequency = this.getPaymentFrequency();
    return frequency?.name || 'Mensuel';
  }
  
  private getPaymentFrequency() {
    if (typeof this.subscription.paymentFrequency === 'object' && this.subscription.paymentFrequency) {
      return this.subscription.paymentFrequency;
    } else if (typeof this.subscription.paymentFrequency === 'number') {
      return this.paymentFrequencyService.frequencies()
        .find(f => f.id === this.subscription.paymentFrequency);
    }
    
    return null;
  }
  
  isMonthlyPayment(): boolean {
    const frequency = this.getPaymentFrequency();
    return !frequency || frequency.months === 1;
  }
  
  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return dateObj.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

}
