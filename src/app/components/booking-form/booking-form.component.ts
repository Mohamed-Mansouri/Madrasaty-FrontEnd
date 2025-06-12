import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParkingSlot } from '../../models/parking-slot.model';
import { Floor } from '../../models/floor.model';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="booking-form" *ngIf="slot && floor && startTime && endTime">
      <h3>Complete Your Booking</h3>
      
      <div class="booking-details">
        <div class="detail-group">
          <span class="detail-label">Floor:</span>
          <span class="detail-value">{{ floor.name }}</span>
        </div>
        
        <div class="detail-group">
          <span class="detail-label">Slot:</span>
          <span class="detail-value">{{ slot.name }}</span>
        </div>
        
        <div class="detail-group">
          <span class="detail-label">From:</span>
          <span class="detail-value">{{ startTime | date:'medium' }}</span>
        </div>
        
        <div class="detail-group">
          <span class="detail-label">To:</span>
          <span class="detail-value">{{ endTime | date:'medium' }}</span>
        </div>
        
        <div class="detail-group">
          <span class="detail-label">Duration:</span>
          <span class="detail-value">{{ calculateDuration() }}</span>
        </div>
      </div>
      
      <div class="customer-info">
        <div class="form-field">
          <label for="customerName">Your Name</label>
          <input 
            type="text" 
            id="customerName" 
            [(ngModel)]="customerName" 
            required
            placeholder="Enter your name"
          >
        </div>
        
        <div class="form-field">
          <label for="vehicleNumber">Vehicle Number</label>
          <input 
            type="text" 
            id="vehicleNumber" 
            [(ngModel)]="vehicleNumber" 
            required
            placeholder="Enter vehicle number"
          >
        </div>
      </div>
      
      <div class="action-buttons">
        <button class="btn cancel" (click)="onCancel()">Cancel</button>
        <button 
          class="btn confirm" 
          [disabled]="!customerName || !vehicleNumber"
          (click)="onConfirm()"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  `,
  styles: [`
    .booking-form {
      padding: 16px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 16px;
    }
    
    h3 {
      margin-top: 0;
      margin-bottom: 16px;
      font-size: 18px;
      color: #333;
      border-bottom: 1px solid #eee;
      padding-bottom: 8px;
    }
    
    .booking-details {
      background-color: #f5f5f5;
      padding: 16px;
      border-radius: 4px;
      margin-bottom: 16px;
    }
    
    .detail-group {
      display: flex;
      margin-bottom: 8px;
    }
    
    .detail-label {
      flex: 0 0 80px;
      font-weight: 500;
      color: #666;
    }
    
    .detail-value {
      color: #333;
    }
    
    .customer-info {
      margin-bottom: 16px;
    }
    
    .form-field {
      margin-bottom: 16px;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: #555;
    }
    
    input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
    
    .action-buttons {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
    }
    
    .btn {
      padding: 10px 16px;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }
    
    .btn.cancel {
      background-color: #f5f5f5;
      color: #666;
    }
    
    .btn.cancel:hover {
      background-color: #e5e5e5;
    }
    
    .btn.confirm {
      background-color: #3366CC;
      color: white;
    }
    
    .btn.confirm:hover {
      background-color: #2855b0;
    }
    
    .btn.confirm:disabled {
      background-color: #a0b4df;
      cursor: not-allowed;
    }
    
    @media (max-width: 768px) {
      .action-buttons {
        flex-direction: column;
      }
      
      .btn {
        width: 100%;
      }
    }
  `]
})
export class BookingFormComponent implements OnInit {
  @Input() slot: ParkingSlot | null = null;
  @Input() floor: Floor | null = null;
  @Input() startTime: Date | null = null;
  @Input() endTime: Date | null = null;
  
  @Output() confirm = new EventEmitter<Booking>();
  @Output() cancel = new EventEmitter<void>();
  
  customerName: string = '';
  vehicleNumber: string = '';
  
  constructor() {}
  
  ngOnInit(): void {}
  
  calculateDuration(): string {
    if (!this.startTime || !this.endTime) {
      return '';
    }
    
    const diffMs = this.endTime.getTime() - this.startTime.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHrs > 0 && diffMins > 0) {
      return `${diffHrs} hr${diffHrs !== 1 ? 's' : ''} ${diffMins} min${diffMins !== 1 ? 's' : ''}`;
    } else if (diffHrs > 0) {
      return `${diffHrs} hr${diffHrs !== 1 ? 's' : ''}`;
    } else {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''}`;
    }
  }
  
  onConfirm(): void {
    if (!this.slot || !this.floor || !this.startTime || !this.endTime) {
      return;
    }
    
    const booking: Omit<Booking, 'id' | 'status'> = {
      slotId: this.slot.id,
      floorId: this.floor.id,
      startTime: this.startTime,
      endTime: this.endTime,
      customerName: this.customerName,
      vehicleNumber: this.vehicleNumber
    };
    
    this.confirm.emit(booking as Booking);
  }
  
  onCancel(): void {
    this.cancel.emit();
  }
}