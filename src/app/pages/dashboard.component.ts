import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';
import { DashboardStats, Student, Teacher, Course, Exam } from '../models/interfaces';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { QuranBookComponent } from '../quran-book/quran-book.component';
import { QuranBook2Component } from '../quran-book2/quran-book2.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,QuranBookComponent,QuranBook2Component],
  template: `
    <div class="container">
      <app-quran-book2/>
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