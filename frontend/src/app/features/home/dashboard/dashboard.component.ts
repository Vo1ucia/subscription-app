import { Component, inject, OnInit } from '@angular/core';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChartComponent } from 'ng-apexcharts';
import { ChartsComponent } from "../charts/charts.component";


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ChartComponent, ChartsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private subscriptionService = inject(SubscriptionService);

  totalMonthly: number = 0;
  totalYearly: number = 0;
  subscriptionCount: number = 0;
  mostExpensiveCategory: { name: string, amount: number } = { name: '', amount: 0 };
  
  ngOnInit(): void {
    // Récupérer les statistiques de base
    this.updateStats();
    
    // S'abonner aux changements de la liste des abonnements
    this.subscriptionService.subscriptions$.subscribe(() => {
      this.updateStats();
    });
    
    // S'abonner au compteur d'abonnements
    this.subscriptionService.getSubscriptionCount().subscribe(count => {
      this.subscriptionCount = count;
    });
  }
  
  updateStats(): void {
    const stats = this.subscriptionService.getSubscriptionStats();
    this.totalMonthly = stats.totalMonthly;
    this.totalYearly = stats.totalYearly;
    this.subscriptionCount = stats.count;
    this.mostExpensiveCategory = stats.mostExpensiveCategory;
  }
}
