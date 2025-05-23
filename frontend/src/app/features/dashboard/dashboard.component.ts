import { Component, inject, OnInit, computed } from '@angular/core';
import { SubscriptionService } from '../../core/services/subscription.service';
import { CommonModule } from '@angular/common';
import { ChartsComponent } from "../charts/charts.component";


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
   // Injection des services
  public subscriptionService = inject(SubscriptionService);
  
  // Signal calculé pour la catégorie la plus coûteuse
  public topCategory = computed(() => {
    const categories = this.subscriptionService.expensesByCategory();
    if (!categories || categories.length === 0) return null;
    
    return categories.reduce((prev, current) => 
      (current.amount > prev.amount) ? current : prev
    );
  });
}
