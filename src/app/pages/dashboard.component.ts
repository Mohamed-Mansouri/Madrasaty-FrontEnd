import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';
import { DashboardStats, Student, Teacher, Course, Exam } from '../models/interfaces';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Dashboard</h1>
        <p>School Management System Overview</p>
      </div>

      <div class="stats-grid" *ngIf="stats$ | async as stats">
        <div class="stat-card students">
          <div class="stat-number">{{ stats.totalStudents }}</div>
          <div class="stat-label">Active Students</div>
        </div>
        <div class="stat-card teachers">
          <div class="stat-number">{{ stats.totalTeachers }}</div>
          <div class="stat-label">Active Teachers</div>
        </div>
        <div class="stat-card courses">
          <div class="stat-number">{{ stats.totalCourses }}</div>
          <div class="stat-label">Active Courses</div>
        </div>
        <div class="stat-card exams">
          <div class="stat-number">{{ stats.upcomingExams }}</div>
          <div class="stat-label">Upcoming Exams</div>
        </div>
      </div>

      <div class="responsive-grid-2" style="margin-bottom: 24px;">
        <div class="data-table">
          <div style="padding: 20px 16px; border-bottom: 1px solid #e0e0e0; background: #f8f9fa;">
            <h3 style="margin: 0; color: #333; font-size: 1.1rem;">Recent Students</h3>
          </div>
          <div style="max-height: 300px; overflow-y: auto;">
            <div class="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Student ID</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let student of recentStudents$ | async">
                    <td>{{ student.firstName }} {{ student.lastName }}</td>
                    <td>{{ student.studentId }}</td>
                    <td>{{ student.grade }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="data-table">
          <div style="padding: 20px 16px; border-bottom: 1px solid #e0e0e0; background: #f8f9fa;">
            <h3 style="margin: 0; color: #333; font-size: 1.1rem;">Upcoming Exams</h3>
          </div>
          <div style="max-height: 300px; overflow-y: auto;">
            <div class="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Exam</th>
                    <th>Course</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let exam of upcomingExams$ | async">
                    <td>{{ exam.title }}</td>
                    <td>{{ exam.courseName }}</td>
                    <td>{{ exam.date | date:'MMM d' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="data-table">
        <div style="padding: 20px 16px; border-bottom: 1px solid #e0e0e0; background: #f8f9fa;">
          <h3 style="margin: 0; color: #333; font-size: 1.1rem;">Active Courses</h3>
        </div>
        <div style="max-height: 400px; overflow-y: auto;">
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Code</th>
                  <th>Teacher</th>
                  <th>Enrolled</th>
                  <th>Capacity</th>
                  <th>Utilization</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let course of activeCourses$ | async">
                  <td>{{ course.name }}</td>
                  <td>{{ course.code }}</td>
                  <td>{{ course.teacherName }}</td>
                  <td>{{ course.enrolledStudents }}</td>
                  <td>{{ course.capacity }}</td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <div style="flex: 1; height: 8px; background: #e0e0e0; border-radius: 4px; overflow: hidden; min-width: 60px;">
                        <div 
                          style="height: 100%; background: #1976D2; transition: width 0.3s ease;"
                          [style.width.%]="(course.enrolledStudents / course.capacity) * 100">
                        </div>
                      </div>
                      <span style="font-size: 0.875rem; color: #666; white-space: nowrap;">
                        {{ ((course.enrolledStudents / course.capacity) * 100).toFixed(0) }}%
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  stats$!: Observable<DashboardStats>;
  recentStudents$!: Observable<Student[]>;
  upcomingExams$!: Observable<Exam[]>;
  activeCourses$!: Observable<Course[]>;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.stats$ = this.dataService.getDashboardStats();
    
    this.recentStudents$ = this.dataService.getStudents().pipe(
      map(students => students.filter(s => s.status === 'active').slice(0, 5))
    );

    this.upcomingExams$ = this.dataService.getExams().pipe(
      map(exams => exams
        .filter(e => e.status === 'scheduled' && new Date(e.date) > new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5)
      )
    );

    this.activeCourses$ = this.dataService.getCourses().pipe(
      map(courses => courses.filter(c => c.status === 'active'))
    );
  }
}