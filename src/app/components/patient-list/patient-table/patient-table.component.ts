import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Patient } from '../../../shared/interfaces/patient.interface';

@Component({
  selector: 'app-patient-table',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <table class="patient-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Condition</th>
          <th>Last Visit</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let patient of patients">
          <td>{{ patient.name }}</td>
          <td>{{ patient.age }}</td>
          <td>{{ patient.condition }}</td>
          <td>{{ patient.lastVisit | date }}</td>
          <td>
            <a [routerLink]="['/patient', patient.id]" class="view-btn">View Details</a>
          </td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [`
    .patient-table {
      width: 100%;
      border-collapse: collapse;
    }
    .patient-table th, .patient-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    .patient-table th {
      background-color: #f5f5f5;
    }
    .view-btn {
      padding: 6px 12px;
      background-color: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 4px;
    }
    .view-btn:hover {
      background-color: #0056b3;
    }
  `]
})
export class PatientTableComponent {
  @Input() patients: Patient[] = [];
}