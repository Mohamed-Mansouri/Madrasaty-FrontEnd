import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';
import { Course, Teacher, Term } from '../models/interfaces';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Courses</h1>
        <p>Manage course offerings and schedules</p>
      </div>

      <div class="controls-container" *ngIf="!showAddForm">
        <div class="search-filters">
          <input 
            type="text" 
            placeholder="Search courses..." 
            [(ngModel)]="searchTerm"
            (input)="filterCourses()"
            style="padding: 10px 16px; border: 2px solid #e0e0e0; border-radius: 6px; font-size: 1rem; min-width: 250px;">
          <select 
            [(ngModel)]="statusFilter"
            (change)="filterCourses()"
            style="padding: 10px 16px; border: 2px solid #e0e0e0; border-radius: 6px; font-size: 1rem;">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button class="btn btn-primary" (click)="showAddForm = true">
          <span class="material-icons" style="font-size: 16px;">add</span>
          Add Course
        </button>
      </div>

      <div class="data-table table-responsive" *ngIf="!showAddForm">
        <table>
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Teacher</th>
              <th>Credits</th>
              <th>Enrollment</th>
              <th>Schedule</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let course of filteredCourses">
              <td><strong>{{ course.code }}</strong></td>
              <td>{{ course.name }}</td>
              <td>{{ course.teacherName }}</td>
              <td>{{ course.credits }}</td>
              <td>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span>{{ course.enrolledStudents }}/{{ course.capacity }}</span>
                  <div style="flex: 1; height: 6px; background: #e0e0e0; border-radius: 3px; overflow: hidden; min-width: 60px;">
                    <div 
                      style="height: 100%; background: #1976D2; transition: width 0.3s ease;"
                      [style.width.%]="(course.enrolledStudents / course.capacity) * 100">
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <div style="font-size: 0.875rem;">
                  <div *ngFor="let schedule of course.schedule">
                    {{ getDayName(schedule.dayOfWeek) }} {{ schedule.startTime }}-{{ schedule.endTime }}
                  </div>
                </div>
              </td>
              <td>
                <span 
                  class="status-badge"
                  [style.background]="course.status === 'active' ? '#43A047' : '#FB8C00'"
                  [style.color]="'white'"
                  [style.padding]="'4px 12px'"
                  [style.border-radius]="'12px'"
                  [style.font-size]="'0.75rem'"
                  [style.font-weight]="'500'">
                  {{ course.status | titlecase }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-secondary" (click)="editCourse(course)">
                    <span class="material-icons" style="font-size: 14px;">edit</span>
                    <span class="btn-text">Edit</span>
                  </button>
                  <button class="btn btn-danger" (click)="deleteCourse(course.id)">
                    <span class="material-icons" style="font-size: 14px;">delete</span>
                    <span class="btn-text">Delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="filteredCourses.length === 0" class="loading">
          No courses found matching your criteria.
        </div>
      </div>

      <div class="form-container" *ngIf="showAddForm">
        <h2>{{ editingCourse ? 'Edit Course' : 'Add New Course' }}</h2>
        <form (ngSubmit)="saveCourse()" #courseForm="ngForm">
          <div class="form-grid-2">
            <div class="form-group">
              <label for="name">Course Name</label>
              <input 
                type="text" 
                id="name" 
                name="name"
                [(ngModel)]="currentCourse.name" 
                required>
            </div>
            <div class="form-group">
              <label for="code">Course Code</label>
              <input 
                type="text" 
                id="code" 
                name="code"
                [(ngModel)]="currentCourse.code" 
                required>
            </div>
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea 
              id="description" 
              name="description"
              [(ngModel)]="currentCourse.description" 
              rows="3">
            </textarea>
          </div>
          <div class="form-grid-3">
            <div class="form-group">
              <label for="teacherId">Teacher</label>
              <select 
                id="teacherId" 
                name="teacherId"
                [(ngModel)]="currentCourse.teacherId" 
                (change)="updateTeacherName()"
                required>
                <option value="">Select Teacher</option>
                <option *ngFor="let teacher of teachers" [value]="teacher.id">
                  {{ teacher.firstName }} {{ teacher.lastName }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="credits">Credits</label>
              <input 
                type="number" 
                id="credits" 
                name="credits"
                [(ngModel)]="currentCourse.credits" 
                min="1" 
                max="6"
                required>
            </div>
            <div class="form-group">
              <label for="capacity">Capacity</label>
              <input 
                type="number" 
                id="capacity" 
                name="capacity"
                [(ngModel)]="currentCourse.capacity" 
                min="1"
                required>
            </div>
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label for="termId">Term</label>
              <select 
                id="termId" 
                name="termId"
                [(ngModel)]="currentCourse.termId" 
                required>
                <option value="">Select Term</option>
                <option *ngFor="let term of terms" [value]="term.id">
                  {{ term.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="status">Status</label>
              <select 
                id="status" 
                name="status"
                [(ngModel)]="currentCourse.status" 
                required>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div style="display: flex; gap: 12px; margin-top: 24px; flex-wrap: wrap;">
            <button type="submit" class="btn btn-primary" [disabled]="!courseForm.form.valid">
              {{ editingCourse ? 'Update Course' : 'Add Course' }}
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
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  teachers: Teacher[] = [];
  terms: Term[] = [];
  searchTerm = '';
  statusFilter = '';
  showAddForm = false;
  editingCourse: Course | null = null;
  currentCourse: Partial<Course> = this.getEmptyCourse();

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getCourses().subscribe(courses => {
      this.courses = courses;
      this.filterCourses();
    });

    this.dataService.getTeachers().subscribe(teachers => {
      this.teachers = teachers.filter(t => t.status === 'active');
    });

    this.dataService.getTerms().subscribe(terms => {
      this.terms = terms;
    });
  }

  filterCourses() {
    this.filteredCourses = this.courses.filter(course => {
      const matchesSearch = !this.searchTerm || 
        course.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        course.teacherName.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.statusFilter || course.status === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }

  editCourse(course: Course) {
    this.editingCourse = course;
    this.currentCourse = { ...course };
    this.showAddForm = true;
  }

  deleteCourse(id: string) {
    if (confirm('Are you sure you want to delete this course?')) {
      // This would call a delete method in the service
      console.log('Delete course:', id);
    }
  }

  saveCourse() {
    if (this.editingCourse) {
      // Update course
      console.log('Update course:', this.currentCourse);
    } else {
      const newCourse = {
        ...this.currentCourse,
        enrolledStudents: 0,
        schedule: []
      } as Omit<Course, 'id'>;
      
      this.dataService.addCourse(newCourse).subscribe(() => {
        this.cancelForm();
      });
    }
  }

  updateTeacherName() {
    if (this.currentCourse.teacherId) {
      const teacher = this.teachers.find(t => t.id === this.currentCourse.teacherId);
      if (teacher) {
        this.currentCourse.teacherName = `${teacher.firstName} ${teacher.lastName}`;
      }
    }
  }

  cancelForm() {
    this.showAddForm = false;
    this.editingCourse = null;
    this.currentCourse = this.getEmptyCourse();
  }

  getDayName(dayOfWeek: number): string {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayOfWeek];
  }

  private getEmptyCourse(): Partial<Course> {
    return {
      name: '',
      code: '',
      description: '',
      credits: 3,
      teacherId: '',
      teacherName: '',
      capacity: 30,
      termId: '',
      status: 'active'
    };
  }
}