import { Category } from "./category";
import { PaymentFrequency } from "./paymentFrequency";
import { User } from "./user";

export interface Subscription {
  id?: number;
  name: string;
  description?: string;
  price: number;
  startDate: Date;
  nextPaymentDate?: Date;
  active: boolean;
  user?: User | number;
  category?: Category | number;
  paymentFrequency?: PaymentFrequency | number;
  createdAt?: Date;
  updatedAt?: Date;
  autoRenew?: boolean;
}