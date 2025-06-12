import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';
import { Teacher } from '../models/interfaces';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Teachers</h1>
        <p>Manage teaching staff and their subjects</p>
      </div>

      <div class="controls-container" *ngIf="!showAddForm">
        <div class="search-filters">
          <input 
            type="text" 
            placeholder="Search teachers..." 
            [(ngModel)]="searchTerm"
            (input)="filterTeachers()"
            style="padding: 10px 16px; border: 2px solid #e0e0e0; border-radius: 6px; font-size: 1rem; min-width: 250px;">
          <select 
            [(ngModel)]="departmentFilter"
            (change)="filterTeachers()"
            style="padding: 10px 16px; border: 2px solid #e0e0e0; border-radius: 6px; font-size: 1rem;">
            <option value="">All Departments</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
            <option value="History">History</option>
            <option value="Arts">Arts</option>
          </select>
        </div>
        <button class="btn btn-primary" (click)="showAddForm = true">
          <span class="material-icons" style="font-size: 16px;">add</span>
          Add Teacher
        </button>
      </div>

      <div class="data-table table-responsive" *ngIf="!showAddForm">
        <table>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Subjects</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let teacher of filteredTeachers">
              <td>{{ teacher.employeeId }}</td>
              <td>{{ teacher.firstName }} {{ teacher.lastName }}</td>
              <td>{{ teacher.department }}</td>
              <td>
                <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                  <span 
                    *ngFor="let subject of teacher.subjects"
                    style="background: #e3f2fd; color: #1976D2; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem;">
                    {{ subject }}
                  </span>
                </div>
              </td>
              <td>{{ teacher.email }}</td>
              <td>
                <span 
                  class="status-badge"
                  [style.background]="teacher.status === 'active' ? '#43A047' : '#FB8C00'"
                  [style.color]="'white'"
                  [style.padding]="'4px 12px'"
                  [style.border-radius]="'12px'"
                  [style.font-size]="'0.75rem'"
                  [style.font-weight]="'500'">
                  {{ teacher.status | titlecase }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-secondary" (click)="editTeacher(teacher)">
                    <span class="material-icons" style="font-size: 14px;">edit</span>
                    <span class="btn-text">Edit</span>
                  </button>
                  <button class="btn btn-danger" (click)="deleteTeacher(teacher.id)">
                    <span class="material-icons" style="font-size: 14px;">delete</span>
                    <span class="btn-text">Delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="filteredTeachers.length === 0" class="loading">
          No teachers found matching your criteria.
        </div>
      </div>

      <div class="form-container" *ngIf="showAddForm">
        <h2>{{ editingTeacher ? 'Edit Teacher' : 'Add New Teacher' }}</h2>
        <form (ngSubmit)="saveTeacher()" #teacherForm="ngForm">
          <div class="form-grid-2">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input 
                type="text" 
                id="firstName" 
                name="firstName"
                [(ngModel)]="currentTeacher.firstName" 
                required>
            </div>
            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input 
                type="text" 
                id="lastName" 
                name="lastName"
                [(ngModel)]="currentTeacher.lastName" 
                required>
            </div>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              [(ngModel)]="currentTeacher.email" 
              required>
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label for="phone">Phone</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone"
                [(ngModel)]="currentTeacher.phone">
            </div>
            <div class="form-group">
              <label for="employeeId">Employee ID</label>
              <input 
                type="text" 
                id="employeeId" 
                name="employeeId"
                [(ngModel)]="currentTeacher.employeeId" 
                required>
            </div>
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label for="department">Department</label>
              <select 
                id="department" 
                name="department"
                [(ngModel)]="currentTeacher.department" 
                required>
                <option value="">Select Department</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="History">History</option>
                <option value="Arts">Arts</option>
              </select>
            </div>
            <div class="form-group">
              <label for="status">Status</label>
              <select 
                id="status" 
                name="status"
                [(ngModel)]="currentTeacher.status" 
                required>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="subjects">Subjects (comma-separated)</label>
            <input 
              type="text" 
              id="subjects" 
              name="subjects"
              [value]="currentTeacher.subjects?.join(', ') || ''"
              (input)="updateSubjects($event)"
              placeholder="e.g., Algebra, Calculus, Statistics">
          </div>
          <div style="display: flex; gap: 12px; margin-top: 24px; flex-wrap: wrap;">
            <button type="submit" class="btn btn-primary" [disabled]="!teacherForm.form.valid">
              {{ editingTeacher ? 'Update Teacher' : 'Add Teacher' }}
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
export class TeachersComponent implements OnInit {
  teachers: Teacher[] = [];
  filteredTeachers: Teacher[] = [];
  searchTerm = '';
  departmentFilter = '';
  showAddForm = false;
  editingTeacher: Teacher | null = null;
  currentTeacher: Partial<Teacher> = this.getEmptyTeacher();

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getTeachers().subscribe(teachers => {
      this.teachers = teachers;
      this.filterTeachers();
    });
  }

  filterTeachers() {
    this.filteredTeachers = this.teachers.filter(teacher => {
      const matchesSearch = !this.searchTerm || 
        teacher.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        teacher.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        teacher.employeeId.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesDepartment = !this.departmentFilter || teacher.department === this.departmentFilter;
      
      return matchesSearch && matchesDepartment;
    });
  }

  editTeacher(teacher: Teacher) {
    this.editingTeacher = teacher;
    this.currentTeacher = { ...teacher };
    this.showAddForm = true;
  }

  deleteTeacher(id: string) {
    if (confirm('Are you sure you want to delete this teacher?')) {
      this.dataService.deleteTeacher(id).subscribe(() => {
        // Data will be updated via the observable subscription
      });
    }
  }

  saveTeacher() {
    if (this.editingTeacher) {
      this.dataService.updateTeacher(this.editingTeacher.id, this.currentTeacher).subscribe(() => {
        this.cancelForm();
      });
    } else {
      const newTeacher = {
        ...this.currentTeacher,
        hireDate: new Date()
      } as Omit<Teacher, 'id'>;
      
      this.dataService.addTeacher(newTeacher).subscribe(() => {
        this.cancelForm();
      });
    }
  }

  updateSubjects(event: any) {
    const value = event.target.value;
    this.currentTeacher.subjects = value ? value.split(',').map((s: string) => s.trim()) : [];
  }

  cancelForm() {
    this.showAddForm = false;
    this.editingTeacher = null;
    this.currentTeacher = this.getEmptyTeacher();
  }

  private getEmptyTeacher(): Partial<Teacher> {
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      employeeId: '',
      department: '',
      subjects: [],
      status: 'active'
    };
  }
}