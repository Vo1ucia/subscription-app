import { Component, input } from '@angular/core';
import { Subscription } from '../../../core/models/subscription';


@Component({
  selector: 'app-subscription-card',
  standalone: true,
  imports: [],
  templateUrl: './subscription-card.component.html',
  styleUrl: './subscription-card.component.scss'
})
export class SubscriptionCardComponent {
  subscription = input<Subscription>({} as Subscription);
}
