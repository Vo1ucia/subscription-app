import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from '../../../core/models/subscription';


@Component({
  selector: 'app-subscription-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription-card.component.html',
  styleUrl: './subscription-card.component.scss'
})
export class SubscriptionCardComponent {
  @Input() subscription!: Subscription;
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Subscription>();

  showDetails = false;
  
  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }
  
  onDeleteClick(): void {
    this.delete.emit(this.subscription.id);
  }
  onEditClick(): void{
    this.edit.emit(this.subscription);
  }

  formatCategory(category: string): string {
    const categories: { [key: string]: string } = {
      'streaming': 'Streaming',
      'music': 'Musique',
      'cloud': 'Cloud',
      'software': 'Logiciel',
      'gaming': 'Gaming',
      'other': 'Autres'
    };
    
    return categories[category] || category;
  }
  
  formatFrequency(frequency: string): string {
    const frequencies: { [key: string]: string } = {
      'monthly': 'Mensuel',
      'yearly': 'Annuel',
      'quarterly': 'Semestriel',
      'weekly': 'Hebdomadaire'
    };
    
    return frequencies[frequency] || frequency;
  }
  
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  formatOriginalPrice(): string {
    switch (this.subscription.frequency) {
      case 'yearly':
        return `${this.subscription.price.toFixed(2)}€/annuel`;
      case 'quarterly':
        return `${this.subscription.price.toFixed(2)}€/semestriel`;
      case 'weekly':
        return `${this.subscription.price.toFixed(2)}€/hebdomadaire`;
      default:
        return '';
    }
  }

  getMonthlyPrice(): number {
    switch (this.subscription.frequency) {
      case 'yearly':
        return this.subscription.price / 12;
      case 'quarterly':
        return this.subscription.price / 3;
      case 'weekly':
        return this.subscription.price * 4.33; // moyenne de semaines par mois
      default:
        return this.subscription.price;
    }
  }

}
