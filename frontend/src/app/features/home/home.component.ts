import { Component, signal  } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SubscriptionListComponent } from './subscription-list/subscription-list.component';
import { SubscriptionFormComponent } from './subscription-form/subscription-form.component';
import { CommonModule } from '@angular/common';
import { ChartComponent } from 'ng-apexcharts';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { ChartsComponent } from "./charts/charts.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    DashboardComponent,
    SubscriptionListComponent,
    NavbarComponent,
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
}
