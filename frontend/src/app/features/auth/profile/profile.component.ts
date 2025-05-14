// src/app/auth/profile/profile.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);
 
  profileForm = this.fb.group({
    username: [{ value: '', disabled: true }],
    email: ['', [Validators.required, Validators.email]],
    firstName: [''],
    lastName: ['']
  });

  passwordForm = this.fb.group({
    oldPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, {
    validators: this.passwordMatchValidator
  });
 
  submitted = false;
  updateSuccess = false;
  updateError: string | null = null;
  passwordUpdateSuccess = false;
  passwordUpdateError: string | null = null;
  isChangingPassword = false;
 
  ngOnInit(): void {
    // Charger les données de l'utilisateur
    const user = this.authService.user();
    if (user) {
      this.profileForm.patchValue({
        username: user.username,
        email: user.email,
        firstName: user.firstName || '',
        lastName: user.lastName || ''
      });
    }
   
    // Rafraîchir les données du profil depuis le serveur
    this.authService.refreshUserProfile().subscribe({
      next: (user) => {
        this.profileForm.patchValue({
          username: user.username,
          email: user.email,
          firstName: user.firstName || '',
          lastName: user.lastName || ''
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement du profil', error);
      }
    });
  }
 
  passwordMatchValidator(formGroup: any): { passwordMismatch: boolean } | null {
    const newPassword = formGroup.get('newPassword').value;
    const confirmPassword = formGroup.get('confirmPassword').value;
   
    if (newPassword !== confirmPassword) {
      return { passwordMismatch: true };
    }
   
    return null;
  }
 
  togglePasswordChange(): void {
    this.isChangingPassword = !this.isChangingPassword;
   
    if (!this.isChangingPassword) {
      this.passwordForm.reset();
      this.passwordUpdateSuccess = false;
      this.passwordUpdateError = null;
    }
  }
 
  // Méthode pour mettre à jour uniquement le profil
  onSubmitProfile(): void {
    this.submitted = true;
    this.updateSuccess = false;
    this.updateError = null;
   
    if (this.profileForm.invalid) {
      return;
    }
   
    const formValues = this.profileForm.value;
   
    // Préparer les données à envoyer
    const userData: any = {
      email: formValues.email,
      firstName: formValues.firstName,
      lastName: formValues.lastName
    };
   
    this.authService.updateProfile(userData).subscribe({
      next: () => {
        this.updateSuccess = true;
        this.submitted = false;
        
        // Rafraîchir les données utilisateur
        this.authService.refreshUserProfile().subscribe();
      },
      error: (error) => {
        this.updateError = error.error?.message || 'Erreur lors de la mise à jour du profil';
      }
    });
  }
  
  // Nouvelle méthode séparée pour changer le mot de passe
  onSubmitPasswordChange(): void {
    this.passwordUpdateSuccess = false;
    this.passwordUpdateError = null;
    
    if (this.passwordForm.invalid) {
      return;
    }
    
    const oldPassword = this.passwordForm.value.oldPassword || '';
    const newPassword = this.passwordForm.value.newPassword || '';
    
    // Maintenant les variables sont garanties d'être de type string
    this.authService.changePassword(oldPassword, newPassword).subscribe({
    next: () => {
      this.passwordUpdateSuccess = true;
      this.passwordForm.reset();
    },
    error: (error) => {
      this.passwordUpdateError = error.error?.error || 'Ancien mot de passe incorrect';
    }
  });
  }
}