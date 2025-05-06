import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from '../../../core/services/subscription.service';
import {
  NgApexchartsModule,
  ApexChart,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexLegend
} from 'ng-apexcharts';
import { CommonModule } from '@angular/common';

export interface ChartOptions {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  responsive: ApexResponsive[];
  legend: ApexLegend;
}

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.scss'
})

export class ChartsComponent implements OnInit{
  chartOptions: ChartOptions = {
    series: [],
    chart: {
      type: 'pie',
      width: 380
    },
    labels: [],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 300 },
          legend: { position: 'bottom' }
        }
      }
    ],
    legend: {
      position: 'right'
    }
  };

  constructor(private subscriptionService: SubscriptionService) {}

  ngOnInit(): void {
    this.subscriptionService.getSubscriptions().subscribe(subs => {
      const categoryTotals: { [key: string]: number } = {};
      subs.forEach(sub => {
        categoryTotals[sub.category] = (categoryTotals[sub.category] || 0) + sub.price;
      });

      this.chartOptions.series = Object.values(categoryTotals);
      this.chartOptions.labels = Object.keys(categoryTotals);
    });
  }
}
