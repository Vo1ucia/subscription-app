import { Injectable,signal, computed } from '@angular/core';
import { Subscription } from '../models/subscription';
import { Observable, tap } from 'rxjs';
import { SubscriptionStats } from '../models/subscriptionStats';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private endpoint = 'subscriptions';
  
  private subscriptionsSignal = signal<Subscription[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  public monthlyTotal = computed(() => this.calculateMonthlyTotal());
  public yearlyTotal = computed(() => this.monthlyTotal() * 12);
  public subscriptionCount = computed(() => this.subscriptionsSignal().length);
  public expensesByCategory = computed(() => this.calculateExpensesByCategory());
  public stats = computed(() => this.calculateSubscriptionStats());
  
  public subscriptions = this.subscriptionsSignal.asReadonly();
  public loading = this.loadingSignal.asReadonly();
  public error = this.errorSignal.asReadonly();

  constructor(private apiService: ApiService) { }

  loadAll(params?: Record<string, any>): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    
    this.apiService.get<Subscription[]>(this.endpoint, params)
      .pipe(
        tap({
          next: (data) => {
            this.subscriptionsSignal.set(data);
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

  loadByUserId(userId: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    
    this.apiService.get<Subscription[]>(`${this.endpoint}/user/${userId}`)
      .pipe(
        tap({
          next: (data) => {
            this.subscriptionsSignal.set(data);
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

  getById(id: number): Observable<Subscription> {
    return this.apiService.get<Subscription>(`${this.endpoint}/${id}`);
  }

  create(subscription: Subscription): Observable<Subscription> {
    return this.apiService.post<Subscription>(this.endpoint, subscription)
      .pipe(
        tap((newSubscription) => {
          this.subscriptionsSignal.update(subs => [...subs, newSubscription]);
        })
      );
  }

  update(id: number, subscription: Partial<Subscription>): Observable<Subscription> {
    return this.apiService.put<Subscription>(`${this.endpoint}/${id}`, subscription)
      .pipe(
        tap((updatedSubscription) => {
          this.subscriptionsSignal.update(subs => 
            subs.map(s => s.id === id ? updatedSubscription : s)
          );
        })
      );
  }

  toggleActive(id: number, active: boolean): Observable<Subscription> {
    return this.apiService.patch<Subscription>(`${this.endpoint}/${id}/activate`, { active })
      .pipe(
        tap((updatedSubscription) => {
          this.subscriptionsSignal.update(subs => 
            subs.map(s => s.id === id ? updatedSubscription : s)
          );
        })
      );
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`)
      .pipe(
        tap(() => {
          this.subscriptionsSignal.update(subs => 
            subs.filter(s => s.id !== id)
          );
        })
      );
  }

 /**
   * Calcule le total mensuel dépensé en abonnements
   * Méthode privée car exposée via signal computed
   */
  private calculateMonthlyTotal(): number {
    return this.subscriptionsSignal().reduce((total, sub) => {
      const monthlyValue = this.getMonthlyValue(sub);
      return total + monthlyValue;
    }, 0);
  }

  /**
   * Récupère des statistiques détaillées sur les abonnements
   * Méthode privée car exposée via signal computed
   */
  private calculateSubscriptionStats(): SubscriptionStats {
    const totalMonthly = this.calculateMonthlyTotal();
    const count = this.subscriptionsSignal().length;
    const categories = this.calculateExpensesByCategory();
    
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
   * Méthode privée car exposée via signal computed
   */
  private calculateExpensesByCategory(): { category: string, amount: number }[] {
    const categoryMap = new Map<string, number>();
    
    this.subscriptionsSignal().forEach(sub => {
      // Obtenir le nom de la catégorie (considère que sub.category est soit un ID, soit un objet Catégorie)
      let categoryName = 'Non catégorisé';
      
      if (typeof sub.category === 'object' && sub.category && 'name' in sub.category) {
        categoryName = sub.category.name;
      } else if (typeof sub.category === 'number') {
        // Ici, vous devriez idéalement accéder au CategoryService pour obtenir le nom
        // mais pour l'instant, nous utiliserons juste l'ID comme chaîne
        categoryName = `Catégorie ${sub.category}`;
      }
      
      const monthlyValue = this.getMonthlyValue(sub);
      const currentTotal = categoryMap.get(categoryName) || 0;
      categoryMap.set(categoryName, currentTotal + monthlyValue);
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
    // Adapter pour utiliser le modèle paymentFrequency
    const amount = subscription.amount || 0;
    
    // Vérifier si paymentFrequency est un objet ou un ID
    if (typeof subscription.paymentFrequency === 'object' && subscription.paymentFrequency) {
      // C'est un objet PaymentFrequency
      const months = subscription.paymentFrequency.months || 1;
      return amount / months;
    } else if (typeof subscription.paymentFrequency === 'number') {
      // C'est un ID, nous devons le rechercher
      // Idéalement, vous devriez utiliser le PaymentFrequencyService ici
      // Mais pour démonstration, nous utiliserons une logique simplifiée
      
      // Vous pourriez injecter PaymentFrequencyService et faire :
      // const frequency = this.paymentFrequencyService.frequencies()
      //   .find(f => f.id === subscription.paymentFrequency);
      // const months = frequency?.months || 1;
      
      // Pour l'instant, utilisons une logique par défaut
      return amount; // Par défaut mensuel
    }
    
    // Si aucune fréquence définie, considérons que c'est mensuel
    return amount;
  }
  
  /**
   * Obtient le montant total annuel des abonnements
   * Méthode pratique pour les composants
   */
  getAnnualTotal(): number {
    return this.calculateMonthlyTotal() * 12;
  }
}
