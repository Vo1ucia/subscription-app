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
    lastName: [''],
    currentPassword: [''],
    newPassword: ['', [Validators.minLength(6)]],
    confirmPassword: ['']
  }, {
    validators: this.passwordMatchValidator
  });
  
  submitted = false;
  updateSuccess = false;
  updateError: string | null = null;
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
    this.authService.refreshUserProfile().subscribe();
  }
  
  passwordMatchValidator(formGroup: any): { passwordMismatch: boolean } | null {
    if (!formGroup.get('newPassword').value) {
      return null;
    }
    
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
      this.profileForm.patchValue({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }
  
  onSubmit(): void {
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
    
    // Ajouter les champs de mot de passe si nécessaire
    if (this.isChangingPassword && formValues.currentPassword && formValues.newPassword) {
      userData.currentPassword = formValues.currentPassword;
      userData.newPassword = formValues.newPassword;
    }
    
    this.authService.updateProfile(userData).subscribe({
      next: () => {
        this.updateSuccess = true;
        
        // Réinitialiser les champs de mot de passe
        if (this.isChangingPassword) {
          this.profileForm.patchValue({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
          this.isChangingPassword = false;
        }
        
        this.submitted = false;
      },
      error: (error) => {
        this.updateError = error.error?.message || 'Erreur lors de la mise à jour du profil';
      }
    });
  }
}