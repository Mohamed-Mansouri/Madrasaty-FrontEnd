import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../shared/interfaces/patient.interface';
import { PatientInfoCardComponent } from './patient-info-card/patient-info-card.component';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, PatientInfoCardComponent],
  template: `
    <div class="container" *ngIf="patient">
      <h2>Patient Details</h2>
      <div class="patient-card">
        <app-patient-info-card [patient]="patient"></app-patient-info-card>
        <div class="actions">
          <a routerLink="/" class="back-btn">Back to List</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    .patient-card {
      background-color: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .back-btn {
      padding: 8px 16px;
      background-color: #6c757d;
      color: white;
      text-decoration: none;
      border-radius: 4px;
    }
    .back-btn:hover {
      background-color: #5a6268;
    }
  `]
})
export class PatientDetailComponent implements OnInit {
  patient?: Patient;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.patientService.getPatient(id).subscribe(
      patient => this.patient = patient
    );
  }
}