import { Component, inject } from '@angular/core';
import { Subscription } from '../../../core/models/subscription';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { SubscriptionCardComponent } from '../../../shared/components/subscription-card/subscription-card.component';
import { CommonModule } from '@angular/common';
import { SubscriptionFormComponent } from '../subscription-form/subscription-form.component';


@Component({
  selector: 'app-subscription-list',
  imports: [SubscriptionCardComponent, CommonModule, SubscriptionFormComponent],
  standalone: true,
  templateUrl: './subscription-list.component.html',
  styleUrl: './subscription-list.component.scss'
})

export class SubscriptionListComponent {
  private subscriptionService = inject(SubscriptionService);
  subscriptions: Subscription[] = [];
  showForm = false;
  currentSubscription: Subscription | null = null;
  
  ngOnInit(): void {
    this.subscriptionService.subscriptions$.subscribe(subs => {
      this.subscriptions = subs;
    });
  }
  
  showAddForm(): void {
    this.currentSubscription = null; // Mode ajout
    this.showForm = true;
  }
  
  onEdit(subscription: Subscription): void {
    this.currentSubscription = subscription; // Mode édition
    this.showForm = true;
  }
  
  hideForm(): void {
    this.showForm = false;
    this.currentSubscription = null;
  }
  
  onDelete(id: string): void {
    this.subscriptionService.deleteSubscription(id);
  }
  
  onSubscriptionAdded(): void {
    this.hideForm();
  }
  
  onSubscriptionUpdated(): void {
    this.hideForm();
  }

}
