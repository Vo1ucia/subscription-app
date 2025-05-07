import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Input() showAddButton: boolean = false;
  @Output() addButtonClicked = new EventEmitter<void>();
  
  onAddButtonClick(): void {
    this.addButtonClicked.emit();
  }
}
