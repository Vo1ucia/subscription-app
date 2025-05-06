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
  @Output() edit = new EventEmitter<string>();

  showDetails = false;
  
  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }
  
  onDeleteClick(): void {
    this.delete.emit(this.subscription.id);
  }
  onEditClick(): void{
    this.edit.emit(this.subscription.id);
  }

  formatCategory(category: string): string {
    const categories: { [key: string]: string } = {
      'streaming': 'Streaming',
      'music': 'Music',
      'cloud': 'Cloud Storage',
      'software': 'Software',
      'gaming': 'Gaming',
      'other': 'Other'
    };
    
    return categories[category] || category;
  }
  
  formatFrequency(frequency: string): string {
    const frequencies: { [key: string]: string } = {
      'monthly': 'Monthly',
      'yearly': 'Yearly',
      'quarterly': 'Quarterly',
      'weekly': 'Weekly'
    };
    
    return frequencies[frequency] || frequency;
  }
  
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

}
