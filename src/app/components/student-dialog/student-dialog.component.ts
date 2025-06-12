import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Student } from '../../models/interfaces';

@Component({
  selector: 'app-student-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dialog-overlay" *ngIf="isOpen" (click)="onOverlayClick($event)">
      <div class="dialog-container" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h2>{{ editingStudent ? 'Edit Student' : 'Add New Student' }}</h2>
          <button class="close-button" (click)="onClose()">
            <span class="material-icons">close</span>
          </button>
        </div>
        
        <div class="dialog-content">
          <form (ngSubmit)="onSubmit()" #studentForm="ngForm">
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
            
            <div class="dialog-actions">
              <button type="button" class="btn btn-secondary" (click)="onClose()">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="!studentForm.form.valid">
                {{ editingStudent ? 'Update Student' : 'Add Student' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
      backdrop-filter: blur(4px);
      animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    
    .dialog-container {
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
      width: 100%;
      max-width: 700px;
      max-height: 90vh;
      overflow: hidden;
      animation: slideIn 0.3s ease;
      border: 1px solid #e2e8f0;
    }
    
    @keyframes slideIn {
      from {
        transform: translateY(20px) scale(0.95);
        opacity: 0;
      }
      to {
        transform: translateY(0) scale(1);
        opacity: 1;
      }
    }
    
    .dialog-header {
      background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%);
      color: white;
      padding: 24px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
    }
    
    .dialog-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #00ACC1, #43A047, #FB8C00);
    }
    
    .dialog-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      letter-spacing: -0.025em;
    }
    
    .close-button {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .close-button:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.1);
    }
    
    .close-button .material-icons {
      font-size: 20px;
    }
    
    .dialog-content {
      padding: 32px;
      max-height: calc(90vh - 120px);
      overflow-y: auto;
    }
    
    .form-group {
      margin-bottom: 24px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .form-group input,
    .form-group select {
      width: 100%;
      padding: 14px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      font-size: 0.875rem;
      transition: all 0.2s ease;
      background: #ffffff;
      color: #1e293b;
      font-weight: 500;
    }
    
    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: #1976D2;
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
    }
    
    .form-grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    
    .form-grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 20px;
    }
    
    .dialog-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
    }
    
    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 10px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
      letter-spacing: 0.025em;
      min-width: 120px;
      justify-content: center;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
    }
    
    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, #1565C0 0%, #0D47A1 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(25, 118, 210, 0.4);
    }
    
    .btn-primary:disabled {
      background: #cbd5e1;
      color: #64748b;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
    
    .btn-secondary {
      background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
      color: #475569;
      border: 1px solid #cbd5e1;
    }
    
    .btn-secondary:hover {
      background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    /* Custom scrollbar for dialog content */
    .dialog-content::-webkit-scrollbar {
      width: 6px;
    }
    
    .dialog-content::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 3px;
    }
    
    .dialog-content::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
      border-radius: 3px;
    }
    
    .dialog-content::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
    }
    
    /* Mobile responsive */
    @media (max-width: 768px) {
      .dialog-overlay {
        padding: 16px;
      }
      
      .dialog-container {
        max-width: 100%;
        max-height: 95vh;
      }
      
      .dialog-header {
        padding: 20px 24px;
      }
      
      .dialog-header h2 {
        font-size: 1.25rem;
      }
      
      .dialog-content {
        padding: 24px;
      }
      
      .form-grid-2,
      .form-grid-3 {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      
      .dialog-actions {
        flex-direction: column-reverse;
        gap: 12px;
      }
      
      .btn {
        width: 100%;
      }
    }
    
    @media (max-width: 480px) {
      .dialog-overlay {
        padding: 12px;
      }
      
      .dialog-header {
        padding: 16px 20px;
      }
      
      .dialog-content {
        padding: 20px;
      }
      
      .form-group input,
      .form-group select {
        padding: 12px 14px;
        font-size: 0.875rem;
      }
    }
  `]
})
export class StudentDialogComponent implements OnInit {
  @Input() isOpen = false;
  @Input() editingStudent: Student | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Partial<Student>>();

  currentStudent: Partial<Student> = this.getEmptyStudent();

  ngOnInit() {
    if (this.editingStudent) {
      this.currentStudent = { ...this.editingStudent };
    } else {
      this.currentStudent = this.getEmptyStudent();
    }
  }

  onOverlayClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onClose() {
    this.close.emit();
    this.resetForm();
  }

  onSubmit() {
    this.save.emit(this.currentStudent);
    this.resetForm();
  }

  onDateOfBirthChange(dateValue: string) {
    this.currentStudent.dateOfBirth = dateValue ? new Date(dateValue) : new Date();
  }

  private resetForm() {
    this.currentStudent = this.getEmptyStudent();
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