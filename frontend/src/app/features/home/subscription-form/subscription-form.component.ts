import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  FormBuilder, 
  FormGroup, 
  ReactiveFormsModule, 
  Validators,
  FormControl
} from '@angular/forms';
import { Subscription } from '../../../core/models/subscription';
import { SubscriptionService } from '../../../core/services/subscription.service';

@Component({
  selector: 'app-subscription-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './subscription-form.component.html',
  styleUrl: './subscription-form.component.scss'
})
export class SubscriptionFormComponent {
  private formBuilder = inject(FormBuilder);
  private subscriptionService = inject(SubscriptionService);
  
  subscriptionForm!: FormGroup;
  submitted = false;
  formSubmitted = false;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.subscriptionForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      frequency: ['monthly', Validators.required],
      category: ['streaming', Validators.required],
      startDate: [new Date().toISOString().split('T')[0], Validators.required],
      description: ['']
    });
  }

  onSubmit(): void {
    this.submitted = true;

    // Arrêter si le formulaire est invalide
    if (this.subscriptionForm.invalid) {
      return;
    }

    // Créer un nouvel objet Subscription
    const formValues = this.subscriptionForm.getRawValue();
    const newSubscription: Subscription = {
      id: Math.floor(Math.random() * 10000).toString(), // ID temporaire
      name: formValues.name,
      price: parseFloat(formValues.price),
      frequency: formValues.frequency,
      category: formValues.category,
      startDate: new Date(formValues.startDate),
      description: formValues.description
    };

    // Ajouter l'abonnement via le service
    this.subscriptionService.addSubscription(newSubscription);
    
    // Afficher le message de succès
    this.formSubmitted = true;
    
    // Réinitialiser le formulaire après un certain délai
    setTimeout(() => {
      this.resetForm();
      this.formSubmitted = false;
    }, 3000);
  }

  resetForm(): void {
    this.submitted = false;
    this.subscriptionForm.reset({
      frequency: 'monthly',
      category: 'streaming',
      startDate: new Date().toISOString().split('T')[0]
    });
  }
}
