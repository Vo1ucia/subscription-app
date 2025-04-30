import { Component } from '@angular/core';
import { ChartsComponent } from './charts/charts.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SubscriptionListComponent } from './subscription-list/subscription-list.component';

@Component({
  selector: 'app-home',
  imports: [
    ChartsComponent,
    DashboardComponent,
    SidebarComponent,
    SubscriptionListComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
