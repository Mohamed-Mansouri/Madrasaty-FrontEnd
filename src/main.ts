import { Component, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './app/services/auth.service';
import { AuthState } from './app/models/interfaces';
import { NavbarComponent } from './app/components/navbar.component';
import { LoginComponent } from './app/components/login.component';
import { SchoolSelectorComponent } from './app/components/school-selector.component';
import { DashboardComponent } from './app/pages/dashboard.component';
import { StudentsComponent } from './app/pages/students.component';
import { TeachersComponent } from './app/pages/teachers.component';
import { CoursesComponent } from './app/pages/courses.component';
import { CalendarComponent } from './app/pages/calendar.component';
import { SchoolsComponent } from './app/pages/schools.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, LoginComponent, SchoolSelectorComponent],
  template: `
    <div class="app-layout" *ngIf="authState">
      <!-- Login Screen -->
      <app-login *ngIf="!authState.isAuthenticated"></app-login>
      
      <!-- School Selector for Super Admin -->
      <app-school-selector 
        *ngIf="authState.isAuthenticated && authState.user?.role === 'super_admin' && !authState.currentSchool">
      </app-school-selector>
      
      <!-- Main Application -->
      <ng-container *ngIf="authState.isAuthenticated && (authState.user?.role !== 'super_admin' || authState.currentSchool)">
        <app-navbar></app-navbar>
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </ng-container>
    </div>
  `,
  styles: [`
    .app-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .main-content {
      flex: 1;
    }
  `]
})
export class App implements OnInit {
  authState: AuthState | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.authState$.subscribe(state => {
      this.authState = state;
    });
  }
}

const routes = [
  { path: '', component: DashboardComponent },
  { path: 'students', component: StudentsComponent },
  { path: 'teachers', component: TeachersComponent },
  { path: 'personnel', component: StudentsComponent }, // Reusing for demo
  { path: 'courses', component: CoursesComponent },
  { path: 'exams', component: StudentsComponent }, // Reusing for demo
  { path: 'terms', component: StudentsComponent }, // Reusing for demo
  { path: 'calendar', component: CalendarComponent },
  { path: 'schools', component: SchoolsComponent },
  { path: 'my-courses', component: CoursesComponent },
  { path: 'my-students', component: StudentsComponent },
  { path: 'my-exams', component: StudentsComponent },
  { path: 'my-schedule', component: CalendarComponent },
  { path: '**', redirectTo: '' }
];

bootstrapApplication(App, {
  providers: [
    provideRouter(routes)
  ]
});