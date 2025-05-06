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
  
  ngOnInit(): void {
    this.subscriptionService.subscriptions$.subscribe(subs => {
      this.subscriptions = subs;
    });
  }
  
  onEdit(id: string): void {
    console.log("edit", id);
  }
  
  onDelete(id: string): void {
    this.subscriptionService.deleteSubscription(id);
  }

  onDetail(id: string): void {
    console.log("detail", id);
  }

  onSubscriptionAdded(): void {
    this.showForm = false;
  }

}
