// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';
import { currentUserResolver } from './core/auth/resolvers/current-user.resolver';

export const routes: Routes = [
  // Route principale - page d'accueil
  {
    path: '',
    loadComponent: () => import('./features/main/main.component').then(m => m.MainComponent),
    resolve: { user: currentUserResolver }
  },
  
  // Routes d'authentification
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/auth/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard],
    resolve: { user: currentUserResolver }
  },
  
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
    resolve: { user: currentUserResolver }
  },
  {
    path: 'subscriptions',
    loadComponent: () => import('./features/subscriptions/subscription-list/subscription-list.component').then(m => m.SubscriptionListComponent),
    canActivate: [authGuard],
    resolve: { user: currentUserResolver }
  },
  
  // Route fallback
  {
    path: '**',
    redirectTo: ''
  }
];