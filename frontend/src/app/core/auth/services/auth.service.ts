// src/app/services/auth.service.ts
import { Injectable, OnInit, computed, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user';

interface AuthResponse {
  token: string;
  user: User;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  
  // Signaux
  private userSignal = signal<User | null>(this.getUserFromStorage());
  private tokenSignal = signal<string | null>(sessionStorage.getItem('token'));
  
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  
  // Signaux publics en lecture seule
  public user = this.userSignal.asReadonly();
  public token = this.tokenSignal.asReadonly();
  public loading = this.loadingSignal.asReadonly();
  public error = this.errorSignal.asReadonly();
  
  // Signal calculé pour l'état d'authentification
  public isAuthenticated = computed(() => !!this.tokenSignal());
  
  // Dépendances
  private http = inject(HttpClient);
  private router = inject(Router);
  
  constructor() {
    effect(() => {
      const token = this.tokenSignal();
      const user = this.userSignal();
    
      if (token) {
        sessionStorage.setItem('token', token);
      } else {
        sessionStorage.removeItem('token');
      }
    
      if (user) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        sessionStorage.removeItem('currentUser');
      }
    });
  }
  
  login(username: string, password: string): Observable<AuthResponse> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { username, password })
      .pipe(
        tap(response => {
          this.tokenSignal.set(response.token);
          this.userSignal.set(response.user);
          this.loadingSignal.set(false);
        }),
        catchError(error => {
          this.loadingSignal.set(false);
          this.errorSignal.set(error.error?.message || 'Échec de connexion');
          return throwError(() => error);
        })
      );
  }
  
  register(registerData: RegisterRequest): Observable<AuthResponse> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, registerData)
      .pipe(
        tap(response => {
          this.tokenSignal.set(response.token);
          this.userSignal.set(response.user);
          this.loadingSignal.set(false);
        }),
        catchError(error => {
          this.loadingSignal.set(false);
          this.errorSignal.set(error.error?.message || 'Échec d\'inscription');
          return throwError(() => error);
        })
      );
  }
  
  logout(): void {
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    this.router.navigate(['/login']);
  }
  
  // Récupérer les informations de l'utilisateur actuel depuis l'API
  refreshUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/view/profile`)
      .pipe(
        tap(user => {
          this.userSignal.set(user);
        }),
        catchError(error => {
          if (error.status === 401) {
            // Token expiré ou invalide
            this.logout();
          }
          return throwError(() => error);
        })
      );
  }
  
  // Met à jour le profil utilisateur
  updateProfile(userData: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/action/profile`, userData)
      .pipe(
        tap(updatedUser => {
          this.userSignal.set(updatedUser);
        })
      );
  }

  /**
  * Change le mot de passe de l'utilisateur connecté
  */
  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/action/profile/change-password`, {
      oldPassword,
      newPassword
    }).pipe(
      tap(() => {
        
      }),
      catchError(error => {
        console.error('Erreur lors de la modification du mot de passe', error);
        return throwError(() => error);
      })
    );
  }
  
  private getUserFromStorage(): User | null {
    const userStr = sessionStorage.getItem('currentUser');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
}