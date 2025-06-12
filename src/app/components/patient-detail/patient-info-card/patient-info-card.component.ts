import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Patient } from '../../../shared/interfaces/patient.interface';
import { formatDate } from '../../../shared/utils/date.utils';

@Component({
  selector: 'app-patient-info-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="patient-info" *ngIf="patient">
      <h3>{{ patient.name }}</h3>
      <p><strong>Age:</strong> {{ patient.age }}</p>
      <p><strong>Gender:</strong> {{ patient.gender }}</p>
      <p><strong>Email:</strong> {{ patient.email }}</p>
      <p><strong>Phone:</strong> {{ patient.phone }}</p>
      <p><strong>Medical Condition:</strong> {{ patient.condition }}</p>
      <p><strong>Last Visit:</strong> {{ formatDate(patient.lastVisit) }}</p>
    </div>
  `,
  styles: [`
    .patient-info {
      margin-bottom: 20px;
    }
    .patient-info h3 {
      margin: 0 0 15px 0;
      color: #333;
    }
    .patient-info p {
      margin: 8px 0;
      color: #666;
    }
  `]
})
export class PatientInfoCardComponent {
  @Input() patient?: Patient;
  
  formatDate(date: Date): string {
    return formatDate(date);
  }
}