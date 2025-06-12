import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';
import { Teacher } from '../models/interfaces';
import { TeacherDialogComponent } from '../components/teacher-dialog/teacher-dialog.component';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule, FormsModule, TeacherDialogComponent],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Teachers</h1>
        <p>Manage teaching staff and their subjects</p>
      </div>

      <div class="controls-container">
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
        <button class="btn btn-primary" (click)="openAddDialog()">
          <span class="material-icons" style="font-size: 16px;">add</span>
          Add Teacher
        </button>
      </div>

      <div class="data-table table-responsive">
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
                  <button class="btn btn-secondary" (click)="openEditDialog(teacher)">
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
    </div>

    <!-- Teacher Dialog -->
    <app-teacher-dialog
      [isOpen]="showDialog"
      [editingTeacher]="editingTeacher"
      (close)="closeDialog()"
      (save)="saveTeacher($event)">
    </app-teacher-dialog>
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
  showDialog = false;
  editingTeacher: Teacher | null = null;

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

  openAddDialog() {
    this.editingTeacher = null;
    this.showDialog = true;
  }

  openEditDialog(teacher: Teacher) {
    this.editingTeacher = teacher;
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
    this.editingTeacher = null;
  }

  saveTeacher(teacherData: Partial<Teacher>) {
    if (this.editingTeacher) {
      this.dataService.updateTeacher(this.editingTeacher.id, teacherData).subscribe(() => {
        this.closeDialog();
        // Refresh the list
        this.dataService.getTeachers().subscribe(teachers => {
          this.teachers = teachers;
          this.filterTeachers();
        });
      });
    } else {
      const newTeacher = {
        ...teacherData,
        hireDate: new Date()
      } as Omit<Teacher, 'id'>;
      
      this.dataService.addTeacher(newTeacher).subscribe(() => {
        this.closeDialog();
        // Refresh the list
        this.dataService.getTeachers().subscribe(teachers => {
          this.teachers = teachers;
          this.filterTeachers();
        });
      });
    }
  }

  deleteTeacher(id: string) {
    if (confirm('Are you sure you want to delete this teacher?')) {
      this.dataService.deleteTeacher(id).subscribe(() => {
        // Data will be updated via the observable subscription
      });
    }
  }
}