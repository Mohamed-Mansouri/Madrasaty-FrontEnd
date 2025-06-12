import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { School } from '../models/interfaces';
import { SchoolDialogComponent } from '../components/school-dialog/school-dialog.component';

@Component({
  selector: 'app-schools',
  standalone: true,
  imports: [CommonModule, FormsModule, SchoolDialogComponent],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Schools Management</h1>
        <p>Manage all schools in the system</p>
      </div>

      <div class="controls-container">
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
        <button class="btn btn-primary" (click)="openAddDialog()">
          <span class="material-icons" style="font-size: 16px;">add</span>
          Add School
        </button>
      </div>

      <div class="schools-grid">
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
            <button class="btn btn-secondary" (click)="openEditDialog(school)">
              <span class="material-icons" style="font-size: 14px;">edit</span>
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- School Dialog -->
    <app-school-dialog
      [isOpen]="showDialog"
      [editingSchool]="editingSchool"
      (close)="closeDialog()"
      (save)="saveSchool($event)">
    </app-school-dialog>
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
  showDialog = false;
  editingSchool: School | null = null;

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

  openAddDialog() {
    this.editingSchool = null;
    this.showDialog = true;
  }

  openEditDialog(school: School) {
    this.editingSchool = school;
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
    this.editingSchool = null;
  }

  saveSchool(schoolData: Partial<School>) {
    if (this.editingSchool) {
      console.log('Update school:', schoolData);
    } else {
      console.log('Add school:', schoolData);
    }
    this.closeDialog();
  }

  manageSchool(schoolId: string) {
    this.authService.switchSchool(schoolId).subscribe();
  }
}