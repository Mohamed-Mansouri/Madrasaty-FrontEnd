import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>School Management System</h1>
          <p>Sign in to your account</p>
        </div>
        
        <form (ngSubmit)="login()" #loginForm="ngForm" class="login-form">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              [(ngModel)]="credentials.email" 
              required
              placeholder="Enter your email">
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              [(ngModel)]="credentials.password" 
              required
              placeholder="Enter your password">
          </div>
          
          <div *ngIf="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary login-btn"
            [disabled]="!loginForm.form.valid || isLoading">
            <span *ngIf="isLoading" class="loading-spinner"></span>
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
        
        <div class="demo-accounts">
          <h3>Demo Accounts</h3>
          <div class="demo-account" (click)="setDemoCredentials('super_admin')">
            <strong>Super Admin</strong>
            <span>admin&#64;system.com</span>
          </div>
          <div class="demo-account" (click)="setDemoCredentials('teacher')">
            <strong>Teacher</strong>
            <span>teacher&#64;school1.edu</span>
          </div>
          <div class="demo-account" (click)="setDemoCredentials('student')">
            <strong>Student</strong>
            <span>student&#64;school1.edu</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    
    .login-card {
      background: white;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }
    
    .login-header {
      text-align: center;
      margin-bottom: 32px;
    }
    
    .login-header h1 {
      color: #1976D2;
      font-size: 1.75rem;
      font-weight: 500;
      margin: 0 0 8px 0;
    }
    
    .login-header p {
      color: #666;
      margin: 0;
    }
    
    .login-form {
      margin-bottom: 32px;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 6px;
      font-weight: 500;
      color: #333;
    }
    
    .form-group input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s ease;
    }
    
    .form-group input:focus {
      outline: none;
      border-color: #1976D2;
    }
    
    .error-message {
      background: #ffebee;
      color: #c62828;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 20px;
      font-size: 0.875rem;
    }
    
    .login-btn {
      width: 100%;
      padding: 14px;
      font-size: 1rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    
    .loading-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .demo-accounts {
      border-top: 1px solid #e0e0e0;
      padding-top: 24px;
    }
    
    .demo-accounts h3 {
      font-size: 1rem;
      color: #333;
      margin: 0 0 16px 0;
      text-align: center;
    }
    
    .demo-account {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 8px;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    
    .demo-account:hover {
      background: #e3f2fd;
    }
    
    .demo-account strong {
      color: #1976D2;
    }
    
    .demo-account span {
      color: #666;
      font-size: 0.875rem;
    }
    
    @media (max-width: 480px) {
      .login-card {
        padding: 24px;
      }
      
      .login-header h1 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };
  
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService) {}

  login() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.login(this.credentials.email, this.credentials.password)
      .subscribe({
        next: () => {
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message;
        }
      });
  }

  setDemoCredentials(role: string) {
    switch (role) {
      case 'super_admin':
        this.credentials = { email: 'admin@system.com', password: 'admin123' };
        break;
      case 'teacher':
        this.credentials = { email: 'teacher@school1.edu', password: 'teacher123' };
        break;
      case 'student':
        this.credentials = { email: 'student@school1.edu', password: 'student123' };
        break;
    }
  }
}