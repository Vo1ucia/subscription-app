import { Injectable } from '@angular/core';
import { Subscription } from '../models/subscription';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private subscriptions: Subscription[] = [
    {
      id: 1,
      name: 'Netflix',
      price: 12.99,
      frequency: 'monthly',
      startDate: '2024-01-15',
      category: 'Streaming'
    },
    {
      id: 2,
      name: 'Spotify',
      price: 9.99,
      frequency: 'monthly',
      startDate: '2024-02-01',
      category: 'Musique'
    }
  ];
  private subscriptionsSubject = new BehaviorSubject<Subscription[]>(this.subscriptions);

  constructor() {}

  // 🔹 Méthode à utiliser dans le component
  getSubscriptions(): Observable<Subscription[]> {
    return this.subscriptionsSubject.asObservable();
  }
}
