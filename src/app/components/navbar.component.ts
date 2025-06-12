import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User, School } from '../models/interfaces';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <!-- Brand/Logo -->
        <div class="navbar-brand">
          <h2>{{ currentSchool?.name || 'School Management' }}</h2>
          <div *ngIf="currentUser" class="user-badge">
            <span class="user-name">{{ currentUser.firstName }} {{ currentUser.lastName }}</span>
            <span class="user-role">{{ getRoleDisplayName(currentUser.role) }}</span>
          </div>
        </div>

        <!-- Mobile Menu Toggle -->
        <button class="mobile-menu-toggle" (click)="toggleMobileMenu()" [class.active]="mobileMenuOpen">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <!-- Navigation Links -->
        <div class="navbar-nav" [class.mobile-open]="mobileMenuOpen">
          <!-- Dashboard - Available to all roles -->
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">
            <span class="material-icons">dashboard</span>
            <span>Dashboard</span>
          </a>
          
          <!-- Student-specific navigation -->
          <ng-container *ngIf="currentUser?.role === 'student'">
            <a routerLink="/my-courses" routerLinkActive="active" class="nav-link">
              <span class="material-icons">book</span>
              <span>My Courses</span>
            </a>
            <a routerLink="/my-exams" routerLinkActive="active" class="nav-link">
              <span class="material-icons">assignment</span>
              <span>My Exams</span>
            </a>
            <a routerLink="/my-schedule" routerLinkActive="active" class="nav-link">
              <span class="material-icons">schedule</span>
              <span>My Schedule</span>
            </a>
          </ng-container>
          
          <!-- Teacher-specific navigation -->
          <ng-container *ngIf="currentUser?.role === 'teacher'">
            <a routerLink="/my-courses" routerLinkActive="active" class="nav-link">
              <span class="material-icons">book</span>
              <span>My Courses</span>
            </a>
            <a routerLink="/my-students" routerLinkActive="active" class="nav-link">
              <span class="material-icons">school</span>
              <span>My Students</span>
            </a>
            <a routerLink="/my-exams" routerLinkActive="active" class="nav-link">
              <span class="material-icons">assignment</span>
              <span>My Exams</span>
            </a>
          </ng-container>
          
          <!-- Admin navigation - Super Admin -->
          <ng-container *ngIf="currentUser?.role === 'super_admin'">
            <div class="nav-dropdown">
              <button class="nav-link dropdown-toggle" (click)="toggleDropdown('manage')">
                <span class="material-icons">manage_accounts</span>
                <span>Manage</span>
                <span class="material-icons dropdown-arrow">keyboard_arrow_down</span>
              </button>
              <div class="dropdown-menu" [class.show]="dropdowns.manage">
                <a routerLink="/students" routerLinkActive="active" class="dropdown-item">
                  <span class="material-icons">school</span>
                  <span>Students</span>
                </a>
                <a routerLink="/teachers" routerLinkActive="active" class="dropdown-item">
                  <span class="material-icons">person</span>
                  <span>Teachers</span>
                </a>
                <a routerLink="/personnel" routerLinkActive="active" class="dropdown-item">
                  <span class="material-icons">badge</span>
                  <span>Personnel</span>
                </a>
              </div>
            </div>
            
            <div class="nav-dropdown">
              <button class="nav-link dropdown-toggle" (click)="toggleDropdown('academic')">
                <span class="material-icons">school</span>
                <span>Academic</span>
                <span class="material-icons dropdown-arrow">keyboard_arrow_down</span>
              </button>
              <div class="dropdown-menu" [class.show]="dropdowns.academic">
                <a routerLink="/courses" routerLinkActive="active" class="dropdown-item">
                  <span class="material-icons">book</span>
                  <span>Courses</span>
                </a>
                <a routerLink="/exams" routerLinkActive="active" class="dropdown-item">
                  <span class="material-icons">assignment</span>
                  <span>Exams</span>
                </a>
                <a routerLink="/terms" routerLinkActive="active" class="dropdown-item">
                  <span class="material-icons">date_range</span>
                  <span>Terms</span>
                </a>
              </div>
            </div>
            
            <a routerLink="/schools" routerLinkActive="active" class="nav-link">
              <span class="material-icons">business</span>
              <span>Schools</span>
            </a>
          </ng-container>
          
          <!-- Calendar - Available to all roles -->
          <a routerLink="/calendar" routerLinkActive="active" class="nav-link">
            <span class="material-icons">calendar_today</span>
            <span>Calendar</span>
          </a>
        </div>

        <!-- User Actions -->
        <div class="navbar-actions">
          <div *ngIf="currentUser?.role === 'super_admin' && currentSchool" class="action-item">
            <button class="btn btn-outline" (click)="switchSchool()">
              <span class="material-icons">swap_horiz</span>
              <span class="btn-text">Switch School</span>
            </button>
          </div>
          <div class="action-item">
            <button class="btn btn-danger" (click)="logout()">
              <span class="material-icons">logout</span>
              <span class="btn-text">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%);
      box-shadow: 0 2px 12px rgba(25, 118, 210, 0.15);
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    
    .navbar-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 70px;
    }
    
    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 24px;
    }
    
    .navbar-brand h2 {
      color: white;
      font-size: 1.5rem;
      font-weight: 500;
      margin: 0;
      white-space: nowrap;
    }
    
    .user-badge {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    
    .user-name {
      color: white;
      font-size: 0.875rem;
      font-weight: 500;
      line-height: 1.2;
    }
    
    .user-role {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      line-height: 1.2;
    }
    
    .mobile-menu-toggle {
      display: none;
      flex-direction: column;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      gap: 4px;
    }
    
    .mobile-menu-toggle span {
      width: 24px;
      height: 2px;
      background: white;
      transition: all 0.3s ease;
    }
    
    .mobile-menu-toggle.active span:nth-child(1) {
      transform: rotate(45deg) translate(6px, 6px);
    }
    
    .mobile-menu-toggle.active span:nth-child(2) {
      opacity: 0;
    }
    
    .mobile-menu-toggle.active span:nth-child(3) {
      transform: rotate(-45deg) translate(6px, -6px);
    }
    
    .navbar-nav {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .nav-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.2s ease;
      white-space: nowrap;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .nav-link:hover,
    .nav-link.active {
      background: rgba(255, 255, 255, 0.15);
      color: white;
    }
    
    .nav-link .material-icons {
      font-size: 18px;
    }
    
    .nav-dropdown {
      position: relative;
    }
    
    .dropdown-toggle {
      position: relative;
    }
    
    .dropdown-arrow {
      font-size: 16px !important;
      transition: transform 0.2s ease;
    }
    
    .dropdown-toggle:hover .dropdown-arrow,
    .dropdown-menu.show ~ .dropdown-toggle .dropdown-arrow {
      transform: rotate(180deg);
    }
    
    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      background: white;
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      min-width: 200px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.2s ease;
      z-index: 1001;
    }
    
    .dropdown-menu.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    
    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      color: #333;
      text-decoration: none;
      transition: background-color 0.2s ease;
      border-radius: 6px;
      margin: 4px;
    }
    
    .dropdown-item:hover,
    .dropdown-item.active {
      background: #f8f9fa;
      color: #1976D2;
    }
    
    .dropdown-item .material-icons {
      font-size: 18px;
      color: #666;
    }
    
    .dropdown-item:hover .material-icons,
    .dropdown-item.active .material-icons {
      color: #1976D2;
    }
    
    .navbar-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .action-item .btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    
    .btn-outline {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .btn-outline:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.5);
    }
    
    .btn-danger {
      background: #F44336;
      color: white;
      border: 1px solid #F44336;
    }
    
    .btn-danger:hover {
      background: #D32F2F;
      border-color: #D32F2F;
    }
    
    .btn .material-icons {
      font-size: 16px;
    }
    
    /* Mobile Styles */
    @media (max-width: 1024px) {
      .user-badge {
        display: none;
      }
      
      .btn-text {
        display: none;
      }
      
      .action-item .btn {
        padding: 10px;
      }
    }
    
    @media (max-width: 768px) {
      .navbar-container {
        padding: 0 16px;
        min-height: 60px;
      }
      
      .navbar-brand h2 {
        font-size: 1.25rem;
      }
      
      .mobile-menu-toggle {
        display: flex;
      }
      
      .navbar-nav {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%);
        flex-direction: column;
        align-items: stretch;
        padding: 16px;
        gap: 4px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      
      .navbar-nav.mobile-open {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }
      
      .nav-link {
        justify-content: flex-start;
        padding: 14px 16px;
        border-radius: 6px;
      }
      
      .nav-dropdown .dropdown-menu {
        position: static;
        opacity: 1;
        visibility: visible;
        transform: none;
        box-shadow: none;
        background: rgba(255, 255, 255, 0.1);
        margin-top: 8px;
        margin-left: 16px;
      }
      
      .dropdown-item {
        color: rgba(255, 255, 255, 0.9);
        margin: 2px;
      }
      
      .dropdown-item:hover,
      .dropdown-item.active {
        background: rgba(255, 255, 255, 0.15);
        color: white;
      }
      
      .dropdown-item .material-icons {
        color: rgba(255, 255, 255, 0.7);
      }
      
      .dropdown-item:hover .material-icons,
      .dropdown-item.active .material-icons {
        color: white;
      }
      
      .navbar-actions {
        position: absolute;
        top: 100%;
        right: 16px;
        background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%);
        padding: 16px;
        border-radius: 0 0 8px 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
        min-width: 200px;
      }
      
      .navbar-nav.mobile-open ~ .navbar-actions {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }
      
      .action-item .btn {
        justify-content: center;
        width: 100%;
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  currentSchool: School | null = null;
  mobileMenuOpen = false;
  dropdowns = {
    manage: false,
    academic: false
  };

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.authState$.subscribe(state => {
      this.currentUser = state.user;
      this.currentSchool = state.currentSchool;
    });
  }

  getRoleDisplayName(role: string): string {
    switch (role) {
      case 'super_admin': return 'Super Administrator';
      case 'teacher': return 'Teacher';
      case 'student': return 'Student';
      default: return role;
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleDropdown(dropdown: keyof typeof this.dropdowns) {
    this.dropdowns[dropdown] = !this.dropdowns[dropdown];
    // Close other dropdowns
    Object.keys(this.dropdowns).forEach(key => {
      if (key !== dropdown) {
        this.dropdowns[key as keyof typeof this.dropdowns] = false;
      }
    });
  }

  switchSchool() {
    this.authService.switchSchool('');
    this.mobileMenuOpen = false;
  }

  logout() {
    this.authService.logout();
    this.mobileMenuOpen = false;
  }
}