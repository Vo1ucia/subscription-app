import { Component, inject,effect } from '@angular/core';
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

  showForm = false;
  currentSubscription: Subscription | null = null;
  subService = inject(SubscriptionService);
  

  ngOnInit(): void {
    this.subService.loadSubscriptionsForCurrentUser();   
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
  
  onSubscriptionUpdated(): void {
    this.hideForm();
    this.subService.loadSubscriptionsForCurrentUser();
  }
  
  onDelete(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet abonnement ?')) {
      this.subService.delete(id).subscribe({
        next: () => console.log('Abonnement supprimé avec succès'),
        error: (err) => console.error('Erreur lors de la suppression:', err)
      });
    }
  }

}
