import { Injectable, computed, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private endpoint = 'users';
  
  // Utilisation des signaux Angular 19
  private usersSignal = signal<User[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  
  // Exposer des signaux en lecture seule
  public users = this.usersSignal.asReadonly();
  public loading = this.loadingSignal.asReadonly();
  public error = this.errorSignal.asReadonly();
  
  // Signal calculé
  public userCount = computed(() => this.usersSignal().length);

  constructor(private apiService: ApiService) { }

  loadAll(params?: Record<string, any>): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    
    this.apiService.get<User[]>(this.endpoint, params)
      .pipe(
        tap({
          next: (data) => {
            this.usersSignal.set(data);
            this.loadingSignal.set(false);
          },
          error: (err) => {
            this.errorSignal.set(err.message);
            this.loadingSignal.set(false);
          }
        })
      )
      .subscribe();
  }

  getById(id: number): Observable<User> {
    return this.apiService.get<User>(`${this.endpoint}/${id}`);
  }

  create(user: User): Observable<User> {
    return this.apiService.post<User>(this.endpoint, user)
      .pipe(
        tap((newUser) => {
          this.usersSignal.update(users => [...users, newUser]);
        })
      );
  }

  update(id: number, user: Partial<User>): Observable<User> {
    return this.apiService.put<User>(`${this.endpoint}/${id}`, user)
      .pipe(
        tap((updatedUser) => {
          this.usersSignal.update(users => 
            users.map(u => u.id === id ? updatedUser : u)
          );
        })
      );
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`)
      .pipe(
        tap(() => {
          this.usersSignal.update(users => 
            users.filter(u => u.id !== id)
          );
        })
      );
  }
}