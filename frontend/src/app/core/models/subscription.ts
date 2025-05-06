export interface Subscription {
    id: string;
    name: string;
    price: number;
    frequency: SubscriptionFrequency;
    category: SubscriptionCategory;
    startDate: Date;
    description?: string;
    // Champs optionnels que vous pourriez vouloir ajouter à l'avenir
    endDate?: Date;
    autoRenewal?: boolean;
    logo?: string;
    website?: string;
    notificationDays?: number; // jours avant renouvellement pour notification
  }
  
  // Types pour les options de fréquence et catégorie
  export type SubscriptionFrequency = 'monthly' | 'yearly' | 'quarterly' | 'weekly';
  export type SubscriptionCategory = 'streaming' | 'music' | 'cloud' | 'software' | 'gaming' | 'other';
  
  // Interface pour les statistiques d'abonnement à afficher sur le dashboard
  export interface SubscriptionStats {
    totalMonthly: number;
    totalYearly: number;
    count: number;
    mostExpensiveCategory: {
      name: string;
      amount: number;
    };
  }
  
  // Interface pour les données du graphique en camembert
  export interface CategoryExpense {
    category: string;
    amount: number;
  }