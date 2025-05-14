import { Component, inject } from '@angular/core';
import { Subscription } from '../../../core/models/subscription';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { SubscriptionCardComponent } from '../../../shared/components/subscription-card/subscription-card.component';
import { CommonModule } from '@angular/common';
import { SubscriptionFormComponent } from '../subscription-form/subscription-form.component';
import { CategoryService } from '../../../core/services/category.service';
import { PaymentFrequencyService } from '../../../core/services/paymentfrequency.service';


@Component({
  selector: 'app-subscription-list',
  imports: [SubscriptionCardComponent, CommonModule, SubscriptionFormComponent],
  standalone: true,
  templateUrl: './subscription-list.component.html',
  styleUrl: './subscription-list.component.scss'
})

export class SubscriptionListComponent {

  showForm = false;
  currentSubscription: Subscription | null = null;

  constructor(
    public subscriptionService: SubscriptionService,
  ) {}

  ngOnInit(): void {
    // Charger les données nécessaires
    this.subscriptionService.loadAll();
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
  
  onDelete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet abonnement ?')) {
      this.subscriptionService.delete(id).subscribe();
    }
  }
  
  onSubscriptionAdded(): void {
    this.hideForm();
  }
  
  onSubscriptionUpdated(): void {
    this.hideForm();
  }

}
