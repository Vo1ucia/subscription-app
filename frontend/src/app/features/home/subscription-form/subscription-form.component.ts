import { Component, Output, EventEmitter, Input } from '@angular/core';
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
  subscriptionForm: FormGroup;
  submitted = false;
  isEditMode = false;
  
  @Input() subscription: Subscription | null = null;
  @Output() cancel = new EventEmitter<void>();
  @Output() subscriptionAdded = new EventEmitter<void>();
  @Output() subscriptionUpdated = new EventEmitter<void>();
  
  constructor(
    private fb: FormBuilder,
    private subscriptionService: SubscriptionService
  ) {
    this.subscriptionForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      frequency: ['monthly', Validators.required],
      category: ['streaming', Validators.required],
      startDate: [new Date().toISOString().split('T')[0], Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.isEditMode = !!this.subscription;
    
    if (this.isEditMode && this.subscription) {
      // Mode édition : pré-remplir le formulaire avec les valeurs existantes
      this.subscriptionForm.patchValue({
        name: this.subscription.name,
        price: this.subscription.price,
        frequency: this.subscription.frequency,
        category: this.subscription.category,
        startDate: this.formatDateForInput(this.subscription.startDate),
        description: this.subscription.description || ''
      });
    }
  }
  
  createForm(): FormGroup {
    return this.fb.group({
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
    
    if (this.subscriptionForm.invalid) {
      return;
    }
    
    const formValues = this.subscriptionForm.getRawValue();
    
    if (this.isEditMode && this.subscription) {
      // Mise à jour d'un abonnement existant
      const updatedSubscription: Subscription = {
        ...this.subscription,
        name: formValues.name,
        price: parseFloat(formValues.price),
        frequency: formValues.frequency,
        category: formValues.category,
        startDate: new Date(formValues.startDate),
        description: formValues.description
      };
      
      this.subscriptionService.updateSubscription(updatedSubscription);
      this.subscriptionUpdated.emit();
    } else {
      // Ajout d'un nouvel abonnement
      const newSubscription: Subscription = {
        id: Math.floor(Math.random() * 10000).toString(),
        name: formValues.name,
        price: parseFloat(formValues.price),
        frequency: formValues.frequency,
        category: formValues.category,
        startDate: new Date(formValues.startDate),
        description: formValues.description
      };
      
      this.subscriptionService.addSubscription(newSubscription);
      this.subscriptionAdded.emit();
    }
  }
  
  onCancel(): void {
    this.cancel.emit();
  }
  
  // Formate la date pour l'input type="date"
  private formatDateForInput(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}
