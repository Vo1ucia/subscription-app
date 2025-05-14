import { Component, inject  } from '@angular/core';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { SubscriptionListComponent } from '../subscriptions/subscription-list/subscription-list.component';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { AuthService } from '../../core/auth/services/auth.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    DashboardComponent,
    SubscriptionListComponent,
    NavbarComponent,
    RouterOutlet
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
    public authService = inject(AuthService);
  
  ngOnInit(): void {
    // Si l'utilisateur est authentifié, charger les données nécessaires
    if (this.authService.isAuthenticated()) {
    }
  }
}
