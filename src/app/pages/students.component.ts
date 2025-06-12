import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';
import { Student } from '../models/interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Students</h1>
        <p>Manage student information and enrollment</p>
      </div>

      <div class="controls-container" *ngIf="!showAddForm">
        <div class="search-filters">
          <input 
            type="text" 
            placeholder="Search students..." 
            [(ngModel)]="searchTerm"
            (input)="filterStudents()"
            style="padding: 10px 16px; border: 2px solid #e0e0e0; border-radius: 6px; font-size: 1rem; min-width: 250px;">
          <select 
            [(ngModel)]="statusFilter"
            (change)="filterStudents()"
            style="padding: 10px 16px; border: 2px solid #e0e0e0; border-radius: 6px; font-size: 1rem;">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="graduated">Graduated</option>
          </select>
        </div>
        <button class="btn btn-primary" (click)="showAddForm = true">
          <span class="material-icons" style="font-size: 16px;">add</span>
          Add Student
        </button>
      </div>

      <div class="data-table table-responsive" *ngIf="!showAddForm">
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Grade</th>
              <th>Status</th>
              <th>Enrollment Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let student of filteredStudents">
              <td>{{ student.studentId }}</td>
              <td>{{ student.firstName }} {{ student.lastName }}</td>
              <td>{{ student.email }}</td>
              <td>{{ student.grade }}</td>
              <td>
                <span 
                  class="status-badge"
                  [style.background]="getStatusColor(student.status)"
                  [style.color]="'white'"
                  [style.padding]="'4px 12px'"
                  [style.border-radius]="'12px'"
                  [style.font-size]="'0.75rem'"
                  [style.font-weight]="'500'">
                  {{ student.status | titlecase }}
                </span>
              </td>
              <td>{{ student.enrollmentDate | date:'MMM d, yyyy' }}</td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-secondary" (click)="editStudent(student)">
                    <span class="material-icons" style="font-size: 14px;">edit</span>
                    <span class="btn-text">Edit</span>
                  </button>
                  <button class="btn btn-danger" (click)="deleteStudent(student.id)">
                    <span class="material-icons" style="font-size: 14px;">delete</span>
                    <span class="btn-text">Delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="filteredStudents.length === 0" class="loading">
          No students found matching your criteria.
        </div>
      </div>

      <div class="form-container" *ngIf="showAddForm">
        <h2>{{ editingStudent ? 'Edit Student' : 'Add New Student' }}</h2>
        <form (ngSubmit)="saveStudent()" #studentForm="ngForm">
          <div class="form-grid-2">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input 
                type="text" 
                id="firstName" 
                name="firstName"
                [(ngModel)]="currentStudent.firstName" 
                required>
            </div>
            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input 
                type="text" 
                id="lastName" 
                name="lastName"
                [(ngModel)]="currentStudent.lastName" 
                required>
            </div>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              [(ngModel)]="currentStudent.email" 
              required>
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label for="phone">Phone</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone"
                [(ngModel)]="currentStudent.phone">
            </div>
            <div class="form-group">
              <label for="studentId">Student ID</label>
              <input 
                type="text" 
                id="studentId" 
                name="studentId"
                [(ngModel)]="currentStudent.studentId" 
                required>
            </div>
          </div>
          <div class="form-grid-3">
            <div class="form-group">
              <label for="grade">Grade</label>
              <select 
                id="grade" 
                name="grade"
                [(ngModel)]="currentStudent.grade" 
                required>
                <option value="">Select Grade</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
              </select>
            </div>
            <div class="form-group">
              <label for="dateOfBirth">Date of Birth</label>
              <input 
                type="date" 
                id="dateOfBirth" 
                name="dateOfBirth"
                [ngModel]="currentStudent.dateOfBirth | date:'yyyy-MM-dd'"
                (ngModelChange)="onDateOfBirthChange($event)">
            </div>
            <div class="form-group">
              <label for="status">Status</label>
              <select 
                id="status" 
                name="status"
                [(ngModel)]="currentStudent.status" 
                required>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="graduated">Graduated</option>
              </select>
            </div>
          </div>
          <div style="display: flex; gap: 12px; margin-top: 24px; flex-wrap: wrap;">
            <button type="submit" class="btn btn-primary" [disabled]="!studentForm.form.valid">
              {{ editingStudent ? 'Update Student' : 'Add Student' }}
            </button>
            <button type="button" class="btn btn-secondary" (click)="cancelForm()">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    @media (max-width: 768px) {
      .btn-text {
        display: none;
      }
    }
    
    @media (min-width: 769px) {
      .btn-text {
        margin-left: 4px;
      }
    }
  `]
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  searchTerm = '';
  statusFilter = '';
  showAddForm = false;
  editingStudent: Student | null = null;
  currentStudent: Partial<Student> = this.getEmptyStudent();

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getStudents().subscribe(students => {
      this.students = students;
      this.filterStudents();
    });
  }

  filterStudents() {
    this.filteredStudents = this.students.filter(student => {
      const matchesSearch = !this.searchTerm || 
        student.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.statusFilter || student.status === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }

  onDateOfBirthChange(dateValue: string) {
    this.currentStudent.dateOfBirth = dateValue ? new Date(dateValue) : new Date();
  }

  editStudent(student: Student) {
    this.editingStudent = student;
    this.currentStudent = { ...student };
    this.showAddForm = true;
  }

  deleteStudent(id: string) {
    if (confirm('Are you sure you want to delete this student?')) {
      this.dataService.deleteStudent(id).subscribe(() => {
        // Data will be updated via the observable subscription
      });
    }
  }

  saveStudent() {
    if (this.editingStudent) {
      this.dataService.updateStudent(this.editingStudent.id, this.currentStudent).subscribe(() => {
        this.cancelForm();
      });
    } else {
      const newStudent = {
        ...this.currentStudent,
        enrollmentDate: new Date(),
        classes: []
      } as Omit<Student, 'id'>;
      
      this.dataService.addStudent(newStudent).subscribe(() => {
        this.cancelForm();
      });
    }
  }

  cancelForm() {
    this.showAddForm = false;
    this.editingStudent = null;
    this.currentStudent = this.getEmptyStudent();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return '#43A047';
      case 'inactive': return '#FB8C00';
      case 'graduated': return '#1976D2';
      default: return '#666';
    }
  }

  private getEmptyStudent(): Partial<Student> {
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: new Date(),
      studentId: '',
      grade: '',
      status: 'active'
    };
  }
}