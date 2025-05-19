import { Component, inject  } from '@angular/core';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { SubscriptionListComponent } from '../subscriptions/subscription-list/subscription-list.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { AuthService } from '../../core/auth/services/auth.service';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-main',
  imports: [DashboardComponent, 
    SubscriptionListComponent,
    CommonModule
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
    public authService = inject(AuthService);
  
  ngOnInit(): void {
    // Si l'utilisateur est authentifié, charger les données nécessaires
    if (this.authService.isAuthenticated()) {
      this.authService.refreshUserProfile().subscribe({
        error: (err) => console.error('Erreur', err)
      });
    }
  }
}
