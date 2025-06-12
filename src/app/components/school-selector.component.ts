import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { School } from '../models/interfaces';

@Component({
  selector: 'app-school-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="school-selector-container">
      <div class="school-selector-card">
        <div class="selector-header">
          <h1>Select School</h1>
          <p>Choose a school to manage</p>
        </div>
        
        <div class="schools-grid">
          <div 
            *ngFor="let school of schools" 
            class="school-card"
            (click)="selectSchool(school.id)">
            <div class="school-info">
              <h3>{{ school.name }}</h3>
              <p class="school-address">{{ school.address }}</p>
              <div class="school-stats">
                <div class="stat">
                  <span class="stat-number">{{ school.totalStudents }}</span>
                  <span class="stat-label">Students</span>
                </div>
                <div class="stat">
                  <span class="stat-number">{{ school.totalTeachers }}</span>
                  <span class="stat-label">Teachers</span>
                </div>
                <div class="stat">
                  <span class="stat-number">{{ school.establishedYear }}</span>
                  <span class="stat-label">Established</span>
                </div>
              </div>
            </div>
            <div class="school-actions">
              <span class="material-icons">arrow_forward</span>
            </div>
          </div>
        </div>
        
        <div class="selector-footer">
          <button class="btn btn-secondary" (click)="logout()">
            <span class="material-icons" style="font-size: 16px;">logout</span>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .school-selector-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    
    .school-selector-card {
      background: white;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 800px;
    }
    
    .selector-header {
      text-align: center;
      margin-bottom: 32px;
    }
    
    .selector-header h1 {
      color: #1976D2;
      font-size: 2rem;
      font-weight: 500;
      margin: 0 0 8px 0;
    }
    
    .selector-header p {
      color: #666;
      margin: 0;
      font-size: 1.1rem;
    }
    
    .schools-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }
    
    .school-card {
      background: #f8f9fa;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      padding: 24px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .school-card:hover {
      border-color: #1976D2;
      background: #e3f2fd;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(25, 118, 210, 0.15);
    }
    
    .school-info {
      flex: 1;
    }
    
    .school-info h3 {
      color: #1976D2;
      font-size: 1.25rem;
      font-weight: 500;
      margin: 0 0 8px 0;
    }
    
    .school-address {
      color: #666;
      font-size: 0.875rem;
      margin: 0 0 16px 0;
    }
    
    .school-stats {
      display: flex;
      gap: 20px;
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
      color: #1976D2;
      opacity: 0.7;
      transition: opacity 0.2s ease;
    }
    
    .school-card:hover .school-actions {
      opacity: 1;
    }
    
    .selector-footer {
      text-align: center;
      border-top: 1px solid #e0e0e0;
      padding-top: 24px;
    }
    
    @media (max-width: 768px) {
      .school-selector-card {
        padding: 24px;
      }
      
      .schools-grid {
        grid-template-columns: 1fr;
      }
      
      .school-stats {
        gap: 16px;
      }
      
      .selector-header h1 {
        font-size: 1.5rem;
      }
    }
    
    @media (max-width: 480px) {
      .school-card {
        flex-direction: column;
        text-align: center;
        gap: 16px;
      }
      
      .school-stats {
        justify-content: center;
      }
    }
  `]
})
export class SchoolSelectorComponent implements OnInit {
  schools: School[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getSchools().subscribe(schools => {
      this.schools = schools;
    });
  }

  selectSchool(schoolId: string) {
    this.authService.switchSchool(schoolId).subscribe();
  }

  logout() {
    this.authService.logout();
  }
}