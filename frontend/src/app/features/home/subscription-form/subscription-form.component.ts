import { Component, Output, EventEmitter } from '@angular/core';
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
  
  @Output() cancel = new EventEmitter<void>();
  @Output() subscriptionAdded = new EventEmitter<void>();
  
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
  
  onSubmit(): void {
    this.submitted = true;
    
    if (this.subscriptionForm.invalid) {
      return;
    }
    
    const formValues = this.subscriptionForm.getRawValue();
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
  
  onCancel(): void {
    this.cancel.emit();
  }
}
