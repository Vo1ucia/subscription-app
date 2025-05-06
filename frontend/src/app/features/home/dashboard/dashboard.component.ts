import { Component } from '@angular/core';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { ChartsComponent } from '../charts/charts.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChartsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  totalSpent: number = 0;
  totalSubscriptions: number = 0;

  constructor(private subscriptionService: SubscriptionService) {}

  ngOnInit(): void {
    this.subscriptionService.getSubscriptions().subscribe(subs => {
      this.totalSubscriptions = subs.length;
      this.totalSpent = subs
        .filter(sub => sub.frequency === 'monthly')
        .reduce((acc, sub) => acc + sub.price, 0);
    });
  }
}
