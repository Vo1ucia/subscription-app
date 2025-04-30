import { Injectable } from '@angular/core';
import { Subscription } from '../models/subscription';

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
  constructor() { }
}
