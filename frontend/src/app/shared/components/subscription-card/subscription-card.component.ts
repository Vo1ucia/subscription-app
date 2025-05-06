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
  @Output() detail = new EventEmitter<string>();
  
  onDeleteClick(): void {
    this.delete.emit(this.subscription.id);
  }
  onEditClick(): void{
    this.edit.emit(this.subscription.id);
  }
  onDetailClick(): void{
    this.detail.emit(this.subscription.id);
  }
}
