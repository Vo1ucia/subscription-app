import { Component, inject } from '@angular/core';
import { Subscription } from '../../../core/models/subscription';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { SubscriptionCardComponent } from '../../../shared/components/subscription-card/subscription-card.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-subscription-list',
  imports: [SubscriptionCardComponent, CommonModule],
  standalone: true,
  templateUrl: './subscription-list.component.html',
  styleUrl: './subscription-list.component.scss'
})

export class SubscriptionListComponent {
  private subscriptionService = inject(SubscriptionService);
  subscriptions: Subscription[] = [];
  
  ngOnInit(): void {
    this.subscriptionService.subscriptions$.subscribe(subs => {
      this.subscriptions = subs;
    });
  }
  
  onAddButtonClick(): void {
    // Émettre un événement pour ouvrir le formulaire d'ajout
    // Vous pouvez implémenter la logique pour afficher le formulaire
  }
  
  onEdit(subscription: Subscription): void {
    console.log('Éditer', subscription);
  }
  
  onDelete(id: string): void {
    this.subscriptionService.deleteSubscription(id);
  }
}
