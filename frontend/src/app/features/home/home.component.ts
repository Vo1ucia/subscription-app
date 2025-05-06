import { Component } from '@angular/core';
import { ChartsComponent } from './charts/charts.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SubscriptionListComponent } from './subscription-list/subscription-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    DashboardComponent,
    SidebarComponent,
    SubscriptionListComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
