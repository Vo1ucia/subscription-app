import { Injectable } from '@angular/core';
import { Subscription } from '../models/subscription';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { SubscriptionStats } from '../models/subscription';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  // Données mock initiales
  private mockSubscriptions: Subscription[] = [
    {
      id: '1',
      name: 'Netflix',
      price: 15.99,
      frequency: 'monthly',
      category: 'streaming',
      startDate: new Date('2023-01-15'),
      description: 'Abonnement standard HD'
    },
    {
      id: '2',
      name: 'Spotify',
      price: 9.99,
      frequency: 'monthly',
      category: 'music',
      startDate: new Date('2022-11-05'),
      description: 'Abonnement Premium'
    },
    {
      id: '3',
      name: 'Microsoft 365',
      price: 69.99,
      frequency: 'yearly',
      category: 'software',
      startDate: new Date('2023-03-10'),
      description: 'Suite Office complète'
    },
    {
      id: '4',
      name: 'Google Drive',
      price: 2.99,
      frequency: 'monthly',
      category: 'cloud',
      startDate: new Date('2023-02-28'),
      description: '100 GB de stockage'
    }
  ];

 // Source de données pour les abonnements
 private subscriptionsSubject = new BehaviorSubject<Subscription[]>(this.mockSubscriptions);
  
 // Observable exposé publiquement
 public subscriptions$: Observable<Subscription[]> = this.subscriptionsSubject.asObservable();
 
 // Observable exposant le nombre d'abonnements
 public subscriptionCount$: Observable<number> = this.subscriptions$.pipe(
   map(subscriptions => subscriptions.length)
 );

 /**
  * Récupère tous les abonnements actifs
  */
 getAllSubscriptions(): Observable<Subscription[]> {
   return this.subscriptions$;
 }

 /**
  * Ajoute un nouvel abonnement à la liste
  */
 addSubscription(subscription: Subscription): void {
   // S'assurer que l'ID est unique (dans un environnement réel, ce serait géré par le backend)
   if (!subscription.id) {
     subscription.id = this.generateUniqueId();
   }
   
   // Ajouter à la liste
   const updatedSubscriptions = [...this.subscriptionsSubject.value, subscription];
   
   // Mettre à jour le BehaviorSubject
   this.subscriptionsSubject.next(updatedSubscriptions);
 }

 /**
  * Supprime un abonnement par son ID
  */
 deleteSubscription(id: string): void {
   const updatedSubscriptions = this.subscriptionsSubject.value.filter(sub => sub.id !== id);
   this.subscriptionsSubject.next(updatedSubscriptions);
 }

 /**
  * Met à jour un abonnement existant
  */
 updateSubscription(updatedSubscription: Subscription): void {
   const updatedSubscriptions = this.subscriptionsSubject.value.map(sub => 
     sub.id === updatedSubscription.id ? updatedSubscription : sub
   );
   this.subscriptionsSubject.next(updatedSubscriptions);
 }

 /**
  * Génère un ID unique pour un nouvel abonnement
  */
 private generateUniqueId(): string {
   return Math.floor(Math.random() * 100000).toString();
 }

 /**
  * Récupère le nombre total d'abonnements
  */
 getSubscriptionCount(): Observable<number> {
   return this.subscriptionCount$;
 }

 /**
  * Calcule le total mensuel dépensé en abonnements
  */
 calculateMonthlyTotal(): number {
   return this.subscriptionsSubject.value.reduce((total, sub) => {
     let monthlyValue = sub.price;
     
     // Convertir les prix selon la fréquence pour avoir un équivalent mensuel
     switch (sub.frequency) {
       case 'yearly':
         monthlyValue = sub.price / 12;
         break;
       case 'quarterly':
         monthlyValue = sub.price / 3;
         break;
       case 'weekly':
         monthlyValue = sub.price * 4.33; // moyenne de semaines par mois
         break;
     }
     
     return total + monthlyValue;
   }, 0);
 }

 /**
  * Récupère des statistiques détaillées sur les abonnements
  */
 getSubscriptionStats(): SubscriptionStats {
   const totalMonthly = this.calculateMonthlyTotal();
   const count = this.subscriptionsSubject.value.length;
   const categories = this.getExpensesByCategory();
   
   // Trouver la catégorie la plus coûteuse
   let mostExpensiveCat = { category: '', amount: 0 };
   
   if (categories.length > 0) {
     mostExpensiveCat = categories.reduce((prev, current) => 
       (current.amount > prev.amount) ? current : prev
     );
   }
   
   return {
     totalMonthly,
     totalYearly: totalMonthly * 12,
     count,
     mostExpensiveCategory: {
       name: mostExpensiveCat.category,
       amount: mostExpensiveCat.amount
     }
   };
 }

 /**
  * Récupère les dépenses par catégorie pour les graphiques
  */
 getExpensesByCategory(): { category: string, amount: number }[] {
   const categoryMap = new Map<string, number>();
   
   this.subscriptionsSubject.value.forEach(sub => {
     const monthlyValue = this.getMonthlyValue(sub);
     const currentTotal = categoryMap.get(sub.category) || 0;
     categoryMap.set(sub.category, currentTotal + monthlyValue);
   });
   
   return Array.from(categoryMap.entries()).map(([category, amount]) => ({
     category,
     amount
   }));
 }

 /**
  * Convertit le prix d'un abonnement en équivalent mensuel
  */
 private getMonthlyValue(subscription: Subscription): number {
   switch (subscription.frequency) {
     case 'yearly':
       return subscription.price / 12;
     case 'quarterly':
       return subscription.price / 3;
     case 'weekly':
       return subscription.price * 4.33;
     default:
       return subscription.price;
   }
 }
}
