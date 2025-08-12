import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { of, catchError, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { User } from '../../models/user';

export const currentUserResolver: ResolveFn<User | null> = () => {
  const auth = inject(AuthService);

  // 1) Si déjà en mémoire (après login), renvoyer direct
  const cached = auth.user();
  if (cached) return of(cached);

  // 2) Si pas de token, ne rien appeler
  if (!auth.isAuthenticated()) return of(null);

  // 3) Sinon, charger depuis l’API
  return auth.refreshUserProfile().pipe(
    catchError(() => of(null))
  );
};
