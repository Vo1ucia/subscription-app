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