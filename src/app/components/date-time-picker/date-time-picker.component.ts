import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-time-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="date-time-picker">
      <h3>Select Date & Time</h3>
      
      <div class="picker-group">
        <div class="picker-field">
          <label for="startDate">Start Date & Time</label>
          <input 
            type="datetime-local" 
            id="startDate" 
            [value]="formatDateForInput(startDate)"
            (change)="onStartDateChange($event)"
            min="{{currentDateString}}"
          >
        </div>
        
        <div class="picker-field">
          <label for="endDate">End Date & Time</label>
          <input 
            type="datetime-local" 
            id="endDate" 
            [value]="formatDateForInput(endDate)"
            (change)="onEndDateChange($event)"
            min="{{formatDateForInput(startDate)}}"
          >
        </div>
      </div>
      
      <div class="duration-display" *ngIf="durationText">
        Duration: {{durationText}}
      </div>
    </div>
  `,
  styles: [`
    .date-time-picker {
      padding: 16px;
      background-color: #f5f5f5;
      border-radius: 8px;
      margin-bottom: 16px;
    }
    
    h3 {
      margin-top: 0;
      margin-bottom: 16px;
      font-size: 18px;
      color: #333;
    }
    
    .picker-group {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }
    
    .picker-field {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    label {
      margin-bottom: 8px;
      font-size: 14px;
      color: #555;
    }
    
    input[type="datetime-local"] {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
    
    .duration-display {
      padding: 8px 12px;
      background-color: #e6f0ff;
      border-radius: 4px;
      font-size: 14px;
      color: #3366CC;
      display: inline-block;
    }
    
    @media (max-width: 768px) {
      .picker-group {
        flex-direction: column;
      }
    }
  `]
})
export class DateTimePickerComponent implements OnInit {
  startDate: Date;
  endDate: Date;
  currentDateString: string;
  durationText: string = '';
  
  @Output() dateRangeChanged = new EventEmitter<{start: Date, end: Date}>();
  
  constructor() {
    // Set default start time to current hour rounded up to nearest hour
    const now = new Date();
    now.setMinutes(0, 0, 0);
    now.setHours(now.getHours() + 1);
    this.startDate = now;
    
    // Set default end time to 2 hours after start time
    const end = new Date(now);
    end.setHours(end.getHours() + 2);
    this.endDate = end;
    
    // Format current date for min attribute
    this.currentDateString = this.formatDateForInput(now);
  }
  
  ngOnInit(): void {
    this.calculateDuration();
    this.emitDateRange();
  }
  
  formatDateForInput(date: Date): string {
    return date.toISOString().slice(0, 16);
  }
  
  onStartDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.startDate = new Date(input.value);
    
    // Ensure end date is after start date
    if (this.endDate <= this.startDate) {
      this.endDate = new Date(this.startDate);
      this.endDate.setHours(this.endDate.getHours() + 1);
    }
    
    this.calculateDuration();
    this.emitDateRange();
  }
  
  onEndDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.endDate = new Date(input.value);
    this.calculateDuration();
    this.emitDateRange();
  }
  
  calculateDuration(): void {
    const diffMs = this.endDate.getTime() - this.startDate.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHrs > 0 && diffMins > 0) {
      this.durationText = `${diffHrs} hr${diffHrs !== 1 ? 's' : ''} ${diffMins} min${diffMins !== 1 ? 's' : ''}`;
    } else if (diffHrs > 0) {
      this.durationText = `${diffHrs} hr${diffHrs !== 1 ? 's' : ''}`;
    } else {
      this.durationText = `${diffMins} min${diffMins !== 1 ? 's' : ''}`;
    }
  }
  
  emitDateRange(): void {
    this.dateRangeChanged.emit({
      start: this.startDate,
      end: this.endDate
    });
  }
}