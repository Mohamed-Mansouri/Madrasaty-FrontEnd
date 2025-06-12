import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-box">
      <input
        type="text"
        [(ngModel)]="searchTerm"
        (input)="onSearchChange()"
        placeholder="Search patients..."
        class="search-input"
      />
    </div>
  `,
  styles: [`
    .search-box {
      margin-bottom: 20px;
    }
    .search-input {
      padding: 8px;
      width: 300px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
  `]
})
export class PatientSearchComponent {
  @Output() search = new EventEmitter<string>();
  searchTerm = '';

  onSearchChange(): void {
    this.search.emit(this.searchTerm);
  }
}