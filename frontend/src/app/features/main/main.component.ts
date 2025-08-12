import { Component, inject } from "@angular/core";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { SubscriptionListComponent } from "../subscriptions/subscription-list/subscription-list.component";
import { AuthService } from "../../core/auth/services/auth.service";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterLink } from '@angular/router';
import { User } from "../../core/models/user";

@Component({
  selector: "app-main",
  imports: [DashboardComponent, SubscriptionListComponent, CommonModule, RouterLink],
  templateUrl: "./main.component.html",
  styleUrl: "./main.component.scss",
})
export class MainComponent {
  private route = inject(ActivatedRoute);
  public auth = inject(AuthService);
  public user: User | null = this.route.snapshot.data['user'] ?? null;

}
