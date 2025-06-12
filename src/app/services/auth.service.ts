import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User, School, AuthState } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStateSubject = new BehaviorSubject<AuthState>({
    user: null,
    isAuthenticated: false,
    currentSchool: null
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor() {
    // Check for existing session
    this.checkExistingSession();
  }

  login(email: string, password: string): Observable<AuthState> {
    // Mock authentication - in real app, this would call your backend
    const mockUsers = this.getMockUsers();
    const user = mockUsers.find(u => u.email === email);
    
    if (user) {
      const authState: AuthState = {
        user,
        isAuthenticated: true,
        currentSchool: user.role !== 'super_admin' ? this.getMockSchools().find(s => s.id === user.schoolId) || null : null
      };
      
      this.authStateSubject.next(authState);
      localStorage.setItem('authState', JSON.stringify(authState));
      return of(authState);
    }
    
    throw new Error('Invalid credentials');
  }

  logout(): void {
    const authState: AuthState = {
      user: null,
      isAuthenticated: false,
      currentSchool: null
    };
    
    this.authStateSubject.next(authState);
    localStorage.removeItem('authState');
  }

  switchSchool(schoolId: string): Observable<School> {
    const currentState = this.authStateSubject.value;
    if (currentState.user?.role === 'super_admin') {
      const school = this.getMockSchools().find(s => s.id === schoolId);
      if (school) {
        const newState = {
          ...currentState,
          currentSchool: school
        };
        this.authStateSubject.next(newState);
        localStorage.setItem('authState', JSON.stringify(newState));
        return of(school);
      }
    }
    throw new Error('Unauthorized to switch schools');
  }

  getCurrentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  getCurrentSchool(): School | null {
    return this.authStateSubject.value.currentSchool;
  }

  hasRole(role: string): boolean {
    return this.authStateSubject.value.user?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const userRole = this.authStateSubject.value.user?.role;
    return userRole ? roles.includes(userRole) : false;
  }

  canAccessSchoolData(): boolean {
    const user = this.getCurrentUser();
    const school = this.getCurrentSchool();
    
    if (user?.role === 'super_admin') {
      return school !== null; // Super admin needs to select a school
    }
    
    return user?.schoolId === school?.id;
  }

  private checkExistingSession(): void {
    const stored = localStorage.getItem('authState');
    if (stored) {
      try {
        const authState = JSON.parse(stored);
        this.authStateSubject.next(authState);
      } catch (error) {
        localStorage.removeItem('authState');
      }
    }
  }

  private getMockUsers(): User[] {
    return [
      {
        id: '1',
        email: 'admin@system.com',
        firstName: 'System',
        lastName: 'Administrator',
        role: 'super_admin',
        isActive: true
      },
      {
        id: '2',
        email: 'teacher@school1.edu',
        firstName: 'Sarah',
        lastName: 'Wilson',
        role: 'teacher',
        schoolId: '1',
        teacherId: '1',
        isActive: true
      },
      {
        id: '3',
        email: 'student@school1.edu',
        firstName: 'John',
        lastName: 'Doe',
        role: 'student',
        schoolId: '1',
        studentId: '1',
        isActive: true
      }
    ];
  }

  private getMockSchools(): School[] {
    return [
      {
        id: '1',
        name: 'Greenwood High School',
        address: '123 Education St, Learning City, LC 12345',
        phone: '+1-555-0100',
        email: 'info@greenwood.edu',
        principalName: 'Dr. Michael Anderson',
        establishedYear: 1985,
        totalStudents: 850,
        totalTeachers: 45,
        status: 'active',
        createdAt: new Date('2020-01-15')
      },
      {
        id: '2',
        name: 'Riverside Academy',
        address: '456 Knowledge Ave, Study Town, ST 67890',
        phone: '+1-555-0200',
        email: 'contact@riverside.edu',
        principalName: 'Ms. Jennifer Martinez',
        establishedYear: 1992,
        totalStudents: 650,
        totalTeachers: 38,
        status: 'active',
        createdAt: new Date('2019-08-20')
      },
      {
        id: '3',
        name: 'Oakwood Elementary',
        address: '789 Learning Blvd, Education City, EC 13579',
        phone: '+1-555-0300',
        email: 'hello@oakwood.edu',
        principalName: 'Mr. Robert Johnson',
        establishedYear: 1978,
        totalStudents: 420,
        totalTeachers: 28,
        status: 'active',
        createdAt: new Date('2021-03-10')
      }
    ];
  }

  getSchools(): Observable<School[]> {
    return of(this.getMockSchools());
  }
}