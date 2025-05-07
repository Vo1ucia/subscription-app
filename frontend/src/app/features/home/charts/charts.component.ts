// charts.component.ts
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { CategoryExpense } from '../../../core/models/subscription';

// Import ng-apexcharts
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ChartComponent
} from 'ng-apexcharts';

// Interface pour les options du graphique
export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: string[];
  colors: string[];
};


@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.scss'
})

export class ChartsComponent implements OnInit{
  @ViewChild("chart") chart!: ChartComponent;
  
  private subscriptionService = inject(SubscriptionService);
  
  public chartOptions: ChartOptions = {
    series: [],
    chart: {
      type: "donut",
      height: 300
    },
    labels: [],
    colors: [
      "#4CAF50", // Vert
      "#2196F3", // Bleu
      "#FFC107", // Jaune
      "#FF5722", // Orange
      "#9C27B0", // Violet
      "#607D8B"  // Gris
    ],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 250
          },
          legend: {
            position: "bottom"
          }
        }
      }
    ]
  };
  
  public hasData = false;
  
  ngOnInit(): void {
    // S'abonner aux changements de données
    this.subscriptionService.subscriptions$.subscribe(() => {
      this.updateChartData();
    });
    
    // Initialiser les données
    this.updateChartData();
  }
  
  updateChartData(): void {
    const categoryExpenses = this.subscriptionService.getExpensesByCategory();
    
    // Vérifier s'il y a des données
    this.hasData = categoryExpenses.length > 0;
    
    if (this.hasData) {
      // Trier par montant (du plus élevé au plus bas)
      categoryExpenses.sort((a, b) => b.amount - a.amount);
      
      // Mettre à jour le graphique
      this.chartOptions.series = categoryExpenses.map(item => item.amount);
      this.chartOptions.labels = categoryExpenses.map(item => this.formatCategoryName(item.category));
      
      // Limiter à 6 catégories maximum pour la lisibilité
      if (categoryExpenses.length > 6) {
        const topCategories = categoryExpenses.slice(0, 5);
        const otherCategories = categoryExpenses.slice(5);
        
        const otherAmount = otherCategories.reduce((total, item) => total + item.amount, 0);
        
        this.chartOptions.series = [
          ...topCategories.map(item => item.amount),
          otherAmount
        ];
        
        this.chartOptions.labels = [
          ...topCategories.map(item => this.formatCategoryName(item.category)),
          "Autres"
        ];
      }
    }
  }
  
  // Mettre en majuscule la première lettre et traduire la catégorie
  formatCategoryName(category: string): string {
    const categoryTranslations: {[key: string]: string} = {
      'streaming': 'Streaming',
      'music': 'Musique',
      'cloud': 'Cloud',
      'software': 'Logiciels',
      'gaming': 'Jeux',
      'other': 'Autres'
    };
    
    return categoryTranslations[category] || category.charAt(0).toUpperCase() + category.slice(1);
  }
}
