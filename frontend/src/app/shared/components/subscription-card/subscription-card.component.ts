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
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  
  getFrequencyLabel(frequency: string): string {
    const labels: { [key: string]: string } = {
      'monthly': 'mois',
      'yearly': 'an',
      'quarterly': 'trimestre',
      'weekly': 'semaine'
    };
    
    return labels[frequency] || frequency;
  }
  
  getCategoryLabel(category: string): string {
    const labels: { [key: string]: string } = {
      'streaming': 'Streaming',
      'music': 'Musique',
      'cloud': 'Cloud',
      'software': 'Logiciel',
      'gaming': 'Jeux',
      'other': 'Autre'
    };
    
    return labels[category] || category;
  }
  
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
  
  onEdit(): void {
    this.edit.emit();
  }
  
  onDelete(): void {
    this.delete.emit();
  }
}
