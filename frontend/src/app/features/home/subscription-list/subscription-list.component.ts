import { Component } from '@angular/core';
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
  subscriptions: Subscription[] = [];

  constructor(private subscriptionService: SubscriptionService) {}

  ngOnInit(): void {
    this.subscriptionService.getSubscriptions().subscribe(data => {
      this.subscriptions = data;
    });
  }
}
