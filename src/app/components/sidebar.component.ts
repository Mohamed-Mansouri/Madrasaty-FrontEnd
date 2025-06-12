import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="sidebar" [class.open]="isOpen">
      <div class="sidebar-header">
        <h2>School Management</h2>
      </div>
      <div class="sidebar-nav">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
          <span class="material-icons" style="margin-right: 8px; font-size: 20px; vertical-align: middle;">dashboard</span>
          Dashboard
        </a>
        <a routerLink="/students" routerLinkActive="active" class="nav-item">
          <span class="material-icons" style="margin-right: 8px; font-size: 20px; vertical-align: middle;">school</span>
          Students
        </a>
        <a routerLink="/teachers" routerLinkActive="active" class="nav-item">
          <span class="material-icons" style="margin-right: 8px; font-size: 20px; vertical-align: middle;">person</span>
          Teachers
        </a>
        <a routerLink="/personnel" routerLinkActive="active" class="nav-item">
          <span class="material-icons" style="margin-right: 8px; font-size: 20px; vertical-align: middle;">badge</span>
          Personnel
        </a>
        <a routerLink="/courses" routerLinkActive="active" class="nav-item">
          <span class="material-icons" style="margin-right: 8px; font-size: 20px; vertical-align: middle;">book</span>
          Courses
        </a>
        <a routerLink="/exams" routerLinkActive="active" class="nav-item">
          <span class="material-icons" style="margin-right: 8px; font-size: 20px; vertical-align: middle;">assignment</span>
          Exams
        </a>
        <a routerLink="/terms" routerLinkActive="active" class="nav-item">
          <span class="material-icons" style="margin-right: 8px; font-size: 20px; vertical-align: middle;">date_range</span>
          Terms
        </a>
        <a routerLink="/calendar" routerLinkActive="active" class="nav-item">
          <span class="material-icons" style="margin-right: 8px; font-size: 20px; vertical-align: middle;">calendar_today</span>
          Calendar
        </a>
      </div>
    </nav>
  `
})
export class SidebarComponent {
  @Input() isOpen = false;
  @Output() toggle = new EventEmitter<void>();
}