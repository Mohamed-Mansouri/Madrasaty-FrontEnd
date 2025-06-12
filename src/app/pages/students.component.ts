import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';
import { Student } from '../models/interfaces';
import { StudentDialogComponent } from '../components/student-dialog/student-dialog.component';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule, StudentDialogComponent],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Students</h1>
        <p>Manage student information and enrollment</p>
      </div>

      <div class="controls-container">
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
        <button class="btn btn-primary" (click)="openAddDialog()">
          <span class="material-icons" style="font-size: 16px;">add</span>
          Add Student
        </button>
      </div>

      <div class="data-table table-responsive">
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
              <td><strong>{{ student.studentId }}</strong></td>
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
                  <button class="btn btn-secondary" (click)="openEditDialog(student)">
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
    </div>

    <!-- Student Dialog -->
    <app-student-dialog
      [isOpen]="showDialog"
      [editingStudent]="editingStudent"
      (close)="closeDialog()"
      (save)="saveStudent($event)">
    </app-student-dialog>
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
  showDialog = false;
  editingStudent: Student | null = null;

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

  openAddDialog() {
    this.editingStudent = null;
    this.showDialog = true;
  }

  openEditDialog(student: Student) {
    this.editingStudent = student;
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
    this.editingStudent = null;
  }

  saveStudent(studentData: Partial<Student>) {
    if (this.editingStudent) {
      // Update existing student
      this.dataService.updateStudent(this.editingStudent.id, studentData).subscribe(() => {
        this.closeDialog();
        // Refresh the list
        this.dataService.getStudents().subscribe(students => {
          this.students = students;
          this.filterStudents();
        });
      });
    } else {
      // Add new student
      const newStudent = {
        ...studentData,
        enrollmentDate: new Date(),
        classes: []
      } as Omit<Student, 'id'>;
      
      this.dataService.addStudent(newStudent).subscribe(() => {
        this.closeDialog();
        // Refresh the list
        this.dataService.getStudents().subscribe(students => {
          this.students = students;
          this.filterStudents();
        });
      });
    }
  }

  deleteStudent(id: string) {
    if (confirm('Are you sure you want to delete this student?')) {
      this.dataService.deleteStudent(id).subscribe(() => {
        // Refresh the list
        this.dataService.getStudents().subscribe(students => {
          this.students = students;
          this.filterStudents();
        });
      });
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return '#43A047';
      case 'inactive': return '#FB8C00';
      case 'graduated': return '#1976D2';
      default: return '#666';
    }
  }
}