import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../shared/interfaces/patient.interface';
import { PatientSearchComponent } from './patient-search/patient-search.component';
import { PatientTableComponent } from './patient-table/patient-table.component';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, PatientSearchComponent, PatientTableComponent],
  template: `
    <div class="container">
      <h2>Patient List</h2>
      <app-patient-search (search)="onSearch($event)"></app-patient-search>
      <app-patient-table [patients]="patients"></app-patient-table>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
  `]
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.patientService.getPatients().subscribe(
      patients => this.patients = patients
    );
  }

  onSearch(searchTerm: string): void {
    if (searchTerm.trim()) {
      this.patientService.filterPatients(searchTerm).subscribe(
        patients => this.patients = patients
      );
    } else {
      this.loadPatients();
    }
  }
}