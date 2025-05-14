export interface User {
  id?: number;
  username: string;
  firstName?: string | null; // Ajout des propriétés manquantes
  lastName?: string | null;  // comme optionnelles avec possibilité d'être null
  email: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}