// Interface pour les statistiques d'abonnement à afficher sur le dashboard
export interface SubscriptionStats {
    totalMonthly: number;      // Total des dépenses mensuelles
    totalYearly: number;       // Total des dépenses annuelles (mensuel * 12)
    count: number;             // Nombre total d'abonnements
    mostExpensiveCategory: {    // Catégorie la plus coûteuse
      name: string;            // Nom de la catégorie
      amount: number;          // Montant dépensé pour cette catégorie
    };
  }