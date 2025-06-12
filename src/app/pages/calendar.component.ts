import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';
import { CalendarEvent, Course, Exam } from '../models/interfaces';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Academic Calendar</h1>
        <p>View course schedules and exam dates</p>
      </div>

      <div class="controls-container" style="margin-bottom: 24px;">
        <div style="display: flex; gap: 16px; align-items: center;">
          <button class="btn btn-secondary" (click)="previousMonth()">
            <span class="material-icons" style="font-size: 16px;">chevron_left</span>
          </button>
          <h2 style="margin: 0; min-width: 200px; text-align: center;">
            {{ currentDate | date:'MMMM yyyy' }}
          </h2>
          <button class="btn btn-secondary" (click)="nextMonth()">
            <span class="material-icons" style="font-size: 16px;">chevron_right</span>
          </button>
        </div>
        <button class="btn btn-primary" (click)="goToToday()">
          Today
        </button>
      </div>

      <div class="calendar-grid">
        <div class="calendar-header">Sunday</div>
        <div class="calendar-header">Monday</div>
        <div class="calendar-header">Tuesday</div>
        <div class="calendar-header">Wednesday</div>
        <div class="calendar-header">Thursday</div>
        <div class="calendar-header">Friday</div>
        <div class="calendar-header">Saturday</div>
        
        <div 
          *ngFor="let day of calendarDays" 
          class="calendar-day"
          [class.other-month]="!day.isCurrentMonth"
          [class.today]="day.isToday">
          <div class="day-number">{{ day.date.getDate() }}</div>
          <div *ngFor="let event of day.events" 
               class="calendar-event"
               [style.background]="event.color"
               [title]="getEventTooltip(event)">
            {{ event.title }}
          </div>
        </div>
      </div>

      <div class="responsive-grid-2" style="margin-top: 32px;">
        <div class="data-table">
          <div style="padding: 20px 16px; border-bottom: 1px solid #e0e0e0; background: #f8f9fa;">
            <h3 style="margin: 0; color: #333; font-size: 1.1rem;">Upcoming Exams</h3>
          </div>
          <div style="max-height: 300px; overflow-y: auto;">
            <div class="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Exam</th>
                    <th>Course</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let exam of upcomingExams">
                    <td>{{ exam.date | date:'MMM d' }}</td>
                    <td>{{ exam.title }}</td>
                    <td>{{ exam.courseName }}</td>
                    <td>{{ exam.startTime }} - {{ exam.endTime }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="data-table">
          <div style="padding: 20px 16px; border-bottom: 1px solid #e0e0e0; background: #f8f9fa;">
            <h3 style="margin: 0; color: #333; font-size: 1.1rem;">Today's Schedule</h3>
          </div>
          <div style="max-height: 300px; overflow-y: auto;">
            <div style="padding: 16px;" *ngIf="todaysEvents.length === 0">
              <p style="color: #666; margin: 0; text-align: center;">No events scheduled for today</p>
            </div>
            <div *ngFor="let event of todaysEvents" style="padding: 16px; border-bottom: 1px solid #f0f0f0;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px;">
                <div style="flex: 1; min-width: 200px;">
                  <h4 style="margin: 0 0 4px 0; color: #333;">{{ event.title }}</h4>
                  <p style="margin: 0; color: #666; font-size: 0.875rem;">
                    {{ event.startTime }} - {{ event.endTime }}
                  </p>
                </div>
                <span 
                  style="padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 500; color: white; white-space: nowrap;"
                  [style.background]="event.color">
                  {{ event.type | titlecase }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CalendarComponent implements OnInit {
  currentDate = new Date();
  calendarDays: CalendarDay[] = [];
  courses: Course[] = [];
  exams: Exam[] = [];
  upcomingExams: Exam[] = [];
  todaysEvents: CalendarEvent[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getCourses().subscribe(courses => {
      this.courses = courses;
      this.generateCalendar();
    });

    this.dataService.getExams().subscribe(exams => {
      this.exams = exams;
      this.upcomingExams = exams
        .filter(e => e.status === 'scheduled' && new Date(e.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 10);
      this.generateCalendar();
    });

    this.updateTodaysEvents();
  }

  generateCalendar() {
    this.calendarDays = [];
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    // Get first day of month and calculate starting date
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const calendarDay: CalendarDay = {
        date: date,
        isCurrentMonth: date.getMonth() === month,
        isToday: this.isSameDay(date, new Date()),
        events: this.getEventsForDate(date)
      };
      
      this.calendarDays.push(calendarDay);
    }
  }

  getEventsForDate(date: Date): CalendarEvent[] {
    const events: CalendarEvent[] = [];
    
    // Add course events for this day of week
    this.courses.forEach(course => {
      course.schedule.forEach(schedule => {
        if (schedule.dayOfWeek === date.getDay()) {
          events.push({
            id: `course-${course.id}-${date.toISOString()}`,
            title: course.code,
            date: date,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            type: 'course',
            courseId: course.id,
            color: '#1976D2',
            description: `${course.name} in ${schedule.room}`,
            schoolId: course.schoolId
          });
        }
      });
    });
    
    // Add exam events
    this.exams.forEach(exam => {
      if (this.isSameDay(new Date(exam.date), date)) {
        events.push({
          id: `exam-${exam.id}`,
          title: exam.title,
          date: date,
          startTime: exam.startTime,
          endTime: exam.endTime,
          type: 'exam',
          examId: exam.id,
          color: '#FB8C00',
          description: `${exam.courseName} - ${exam.room}`,
          schoolId: exam.schoolId
        });
      }
    });
    
    return events.slice(0, 3); // Limit to 3 events per day for display
  }

  updateTodaysEvents() {
    const today = new Date();
    this.todaysEvents = this.getEventsForDate(today);
  }

  previousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.generateCalendar();
  }

  goToToday() {
    this.currentDate = new Date();
    this.generateCalendar();
    this.updateTodaysEvents();
  }

  getEventTooltip(event: CalendarEvent): string {
    return `${event.title}\n${event.startTime} - ${event.endTime}\n${event.description || ''}`;
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}