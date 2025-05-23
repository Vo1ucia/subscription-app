import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { PaymentFrequency } from '../models/paymentFrequency';

@Injectable({
  providedIn: 'root'
})
export class PaymentFrequencyService {
  private endpoint = 'payment-frequencies';  // Ajustez selon votre API
  
  private frequenciesSignal = signal<PaymentFrequency[]>([]);
  private loadingSignal = signal<boolean>(false);
  
  public frequencies = this.frequenciesSignal.asReadonly();
  public loading = this.loadingSignal.asReadonly();

  constructor(private apiService: ApiService) { }

  loadAll(): void {
    this.loadingSignal.set(true);
    
    this.apiService.get<PaymentFrequency[]>(this.endpoint)
      .pipe(
        tap({
          next: (data) => {
            this.frequenciesSignal.set(data);
            this.loadingSignal.set(false);
          },
          error: () => {
            this.loadingSignal.set(false);
          }
        })
      )
      .subscribe();
  }

  getById(id: number): Observable<PaymentFrequency> {
    return this.apiService.get<PaymentFrequency>(`${this.endpoint}/${id}`);
  }

  create(frequency: PaymentFrequency): Observable<PaymentFrequency> {
    return this.apiService.post<PaymentFrequency>(this.endpoint, frequency)
      .pipe(
        tap((newFrequency) => {
          this.frequenciesSignal.update(freqs => [...freqs, newFrequency]);
        })
      );
  }

  update(id: number, frequency: Partial<PaymentFrequency>): Observable<PaymentFrequency> {
    return this.apiService.put<PaymentFrequency>(`${this.endpoint}/${id}`, frequency)
      .pipe(
        tap((updatedFrequency) => {
          this.frequenciesSignal.update(freqs => 
            freqs.map(f => f.id === id ? updatedFrequency : f)
          );
        })
      );
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`)
      .pipe(
        tap(() => {
          this.frequenciesSignal.update(freqs => 
            freqs.filter(f => f.id !== id)
          );
        })
      );
  }
}