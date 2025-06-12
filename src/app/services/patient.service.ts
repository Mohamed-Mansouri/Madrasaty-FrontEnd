import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Patient } from '../shared/interfaces/patient.interface';
import { searchInObject } from '../shared/utils/search.utils';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private patients: Patient[] = [
    {
      id: 1,
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      email: 'john@example.com',
      phone: '555-0123',
      condition: 'Hypertension',
      lastVisit: new Date('2023-12-01')
    },
    {
      id: 2,
      name: 'Jane Smith',
      age: 32,
      gender: 'Female',
      email: 'jane@example.com',
      phone: '555-0124',
      condition: 'Diabetes',
      lastVisit: new Date('2023-12-05')
    }
  ];

  getPatients(): Observable<Patient[]> {
    return of(this.patients);
  }

  getPatient(id: number): Observable<Patient | undefined> {
    return of(this.patients.find(patient => patient.id === id));
  }

  filterPatients(searchTerm: string): Observable<Patient[]> {
    const filtered = this.patients.filter(patient =>
      searchInObject(patient, searchTerm, ['name', 'condition'])
    );
    return of(filtered);
  }
}