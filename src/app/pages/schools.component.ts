import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { School } from '../models/interfaces';

@Component({
  selector: 'app-schools',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Schools Management</h1>
        <p>Manage all schools in the system</p>
      </div>

      <div class="controls-container" *ngIf="!showAddForm">
        <div class="search-filters">
          <input 
            type="text" 
            placeholder="Search schools..." 
            [(ngModel)]="searchTerm"
            (input)="filterSchools()"
            style="padding: 10px 16px; border: 2px solid #e0e0e0; border-radius: 6px; font-size: 1rem; min-width: 250px;">
          <select 
            [(ngModel)]="statusFilter"
            (change)="filterSchools()"
            style="padding: 10px 16px; border: 2px solid #e0e0e0; border-radius: 6px; font-size: 1rem;">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button class="btn btn-primary" (click)="showAddForm = true">
          <span class="material-icons" style="font-size: 16px;">add</span>
          Add School
        </button>
      </div>

      <div class="schools-grid" *ngIf="!showAddForm">
        <div *ngFor="let school of filteredSchools" class="school-card">
          <div class="school-header">
            <h3>{{ school.name }}</h3>
            <span 
              class="status-badge"
              [style.background]="school.status === 'active' ? '#43A047' : '#FB8C00'"
              [style.color]="'white'"
              [style.padding]="'4px 12px'"
              [style.border-radius]="'12px'"
              [style.font-size]="'0.75rem'"
              [style.font-weight]="'500'">
              {{ school.status | titlecase }}
            </span>
          </div>
          
          <div class="school-info">
            <p><strong>Principal:</strong> {{ school.principalName }}</p>
            <p><strong>Address:</strong> {{ school.address }}</p>
            <p><strong>Phone:</strong> {{ school.phone }}</p>
            <p><strong>Email:</strong> {{ school.email }}</p>
            <p><strong>Established:</strong> {{ school.establishedYear }}</p>
          </div>
          
          <div class="school-stats">
            <div class="stat">
              <span class="stat-number">{{ school.totalStudents }}</span>
              <span class="stat-label">Students</span>
            </div>
            <div class="stat">
              <span class="stat-number">{{ school.totalTeachers }}</span>
              <span class="stat-label">Teachers</span>
            </div>
          </div>
          
          <div class="school-actions">
            <button class="btn btn-primary" (click)="manageSchool(school.id)">
              <span class="material-icons" style="font-size: 14px;">settings</span>
              Manage
            </button>
            <button class="btn btn-secondary" (click)="editSchool(school)">
              <span class="material-icons" style="font-size: 14px;">edit</span>
              Edit
            </button>
          </div>
        </div>
      </div>

      <div class="form-container" *ngIf="showAddForm">
        <h2>{{ editingSchool ? 'Edit School' : 'Add New School' }}</h2>
        <form (ngSubmit)="saveSchool()" #schoolForm="ngForm">
          <div class="form-grid-2">
            <div class="form-group">
              <label for="name">School Name</label>
              <input 
                type="text" 
                id="name" 
                name="name"
                [(ngModel)]="currentSchool.name" 
                required>
            </div>
            <div class="form-group">
              <label for="principalName">Principal Name</label>
              <input 
                type="text" 
                id="principalName" 
                name="principalName"
                [(ngModel)]="currentSchool.principalName" 
                required>
            </div>
          </div>
          
          <div class="form-group">
            <label for="address">Address</label>
            <textarea 
              id="address" 
              name="address"
              [(ngModel)]="currentSchool.address" 
              rows="3"
              required>
            </textarea>
          </div>
          
          <div class="form-grid-2">
            <div class="form-group">
              <label for="phone">Phone</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone"
                [(ngModel)]="currentSchool.phone" 
                required>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                [(ngModel)]="currentSchool.email" 
                required>
            </div>
          </div>
          
          <div class="form-grid-3">
            <div class="form-group">
              <label for="establishedYear">Established Year</label>
              <input 
                type="number" 
                id="establishedYear" 
                name="establishedYear"
                [(ngModel)]="currentSchool.establishedYear" 
                min="1800" 
                max="2024"
                required>
            </div>
            <div class="form-group">
              <label for="totalStudents">Total Students</label>
              <input 
                type="number" 
                id="totalStudents" 
                name="totalStudents"
                [(ngModel)]="currentSchool.totalStudents" 
                min="0"
                required>
            </div>
            <div class="form-group">
              <label for="status">Status</label>
              <select 
                id="status" 
                name="status"
                [(ngModel)]="currentSchool.status" 
                required>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          <div style="display: flex; gap: 12px; margin-top: 24px; flex-wrap: wrap;">
            <button type="submit" class="btn btn-primary" [disabled]="!schoolForm.form.valid">
              {{ editingSchool ? 'Update School' : 'Add School' }}
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
    .schools-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
    }
    
    .school-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .school-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }
    
    .school-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .school-header h3 {
      color: #1976D2;
      font-size: 1.25rem;
      font-weight: 500;
      margin: 0;
    }
    
    .school-info {
      margin-bottom: 20px;
    }
    
    .school-info p {
      margin: 8px 0;
      color: #666;
      font-size: 0.875rem;
    }
    
    .school-info strong {
      color: #333;
    }
    
    .school-stats {
      display: flex;
      gap: 24px;
      margin-bottom: 20px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    
    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .stat-number {
      font-size: 1.5rem;
      font-weight: 500;
      color: #1976D2;
      line-height: 1;
    }
    
    .stat-label {
      font-size: 0.75rem;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 4px;
    }
    
    .school-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    
    .school-actions .btn {
      flex: 1;
      min-width: 120px;
    }
    
    @media (max-width: 768px) {
      .schools-grid {
        grid-template-columns: 1fr;
      }
      
      .school-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
      
      .school-stats {
        justify-content: space-around;
      }
      
      .school-actions {
        flex-direction: column;
      }
      
      .school-actions .btn {
        width: 100%;
      }
    }
  `]
})
export class SchoolsComponent implements OnInit {
  schools: School[] = [];
  filteredSchools: School[] = [];
  searchTerm = '';
  statusFilter = '';
  showAddForm = false;
  editingSchool: School | null = null;
  currentSchool: Partial<School> = this.getEmptySchool();

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getSchools().subscribe(schools => {
      this.schools = schools;
      this.filterSchools();
    });
  }

  filterSchools() {
    this.filteredSchools = this.schools.filter(school => {
      const matchesSearch = !this.searchTerm || 
        school.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        school.principalName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        school.address.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.statusFilter || school.status === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }

  manageSchool(schoolId: string) {
    this.authService.switchSchool(schoolId).subscribe();
  }

  editSchool(school: School) {
    this.editingSchool = school;
    this.currentSchool = { ...school };
    this.showAddForm = true;
  }

  saveSchool() {
    if (this.editingSchool) {
      console.log('Update school:', this.currentSchool);
    } else {
      console.log('Add school:', this.currentSchool);
    }
    this.cancelForm();
  }

  cancelForm() {
    this.showAddForm = false;
    this.editingSchool = null;
    this.currentSchool = this.getEmptySchool();
  }

  private getEmptySchool(): Partial<School> {
    return {
      name: '',
      address: '',
      phone: '',
      email: '',
      principalName: '',
      establishedYear: new Date().getFullYear(),
      totalStudents: 0,
      totalTeachers: 0,
      status: 'active'
    };
  }
}