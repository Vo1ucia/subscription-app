import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private endpoint = 'categories';
  
  private categoriesSignal = signal<Category[]>([]);
  private loadingSignal = signal<boolean>(false);
  
  public categories = this.categoriesSignal.asReadonly();
  public loading = this.loadingSignal.asReadonly();

  constructor(private apiService: ApiService) { }

  loadAll(): void {
    this.loadingSignal.set(true);
    
    this.apiService.get<Category[]>(this.endpoint)
      .pipe(
        tap({
          next: (data) => {
            this.categoriesSignal.set(data);
            this.loadingSignal.set(false);
          },
          error: () => {
            this.loadingSignal.set(false);
          }
        })
      )
      .subscribe();
  }

  getById(id: number): Observable<Category> {
    return this.apiService.get<Category>(`${this.endpoint}/${id}`);
  }

  create(category: Category): Observable<Category> {
    return this.apiService.post<Category>(this.endpoint, category)
      .pipe(
        tap((newCategory) => {
          this.categoriesSignal.update(cats => [...cats, newCategory]);
        })
      );
  }

  update(id: number, category: Partial<Category>): Observable<Category> {
    return this.apiService.put<Category>(`${this.endpoint}/${id}`, category)
      .pipe(
        tap((updatedCategory) => {
          this.categoriesSignal.update(cats => 
            cats.map(c => c.id === id ? updatedCategory : c)
          );
        })
      );
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`)
      .pipe(
        tap(() => {
          this.categoriesSignal.update(cats => 
            cats.filter(c => c.id !== id)
          );
        })
      );
  }
}