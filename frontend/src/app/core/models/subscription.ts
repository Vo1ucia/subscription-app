export interface Subscription {
    id: number;
    name: string;
    price: number;
    frequency: 'monthly' | 'yearly';
    startDate: string;
    category: string;
}
