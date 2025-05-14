import { Category } from "./category";
import { PaymentFrequency } from "./paymentFrequency";
import { User } from "./user";

export interface Subscription {
  id?: number;
  name: string;
  description?: string;
  amount: number;
  startDate: Date;
  endDate?: Date;
  active: boolean;
  user?: User | number;
  category?: Category | number;
  paymentFrequency?: PaymentFrequency | number;
  createdAt?: Date;
  updatedAt?: Date;
}