import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Booking } from '../../models/booking.model';
import { ParkingSlot } from '../../models/parking-slot.model';
import { Floor } from '../../models/floor.model';

@Component({
  selector: 'app-booking-success',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="success-modal" *ngIf="booking && slot && floor">
      <div class="success-content">
        <div class="header">
          <h2>Booking Confirmed!</h2>
          <div class="success-icon">✓</div>
        </div>
        
        <div class="booking-details">
          <h3>Booking Information</h3>
          
          <div class="detail-row">
            <span class="label">Booking ID:</span>
            <span class="value">{{ booking.id }}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Floor:</span>
            <span class="value">{{ floor.name }}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Parking Slot:</span>
            <span class="value">{{ slot.name }}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Start Time:</span>
            <span class="value">{{ booking.startTime | date:'medium' }}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">End Time:</span>
            <span class="value">{{ booking.endTime | date:'medium' }}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Duration:</span>
            <span class="value">{{ calculateDuration() }}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Name:</span>
            <span class="value">{{ booking.customerName }}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Vehicle Number:</span>
            <span class="value">{{ booking.vehicleNumber }}</span>
          </div>
        </div>
        
        <div class="instructions">
          <p><strong>Important:</strong> Please arrive at your parking slot 5 minutes before your booking time.</p>
          <p>You can manage your booking in the "My Bookings" section.</p>
        </div>
        
        <div class="action-buttons">
          <button class="btn primary" (click)="onDone()">Done</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .success-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 16px;
    }
    
    .success-content {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      width: 100%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    .header {
      background-color: #4CAF50;
      color: white;
      padding: 16px 24px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    h2 {
      margin: 0;
      font-size: 24px;
    }
    
    .success-icon {
      background-color: white;
      color: #4CAF50;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: bold;
    }
    
    .booking-details {
      padding: 24px;
      border-bottom: 1px solid #eee;
    }
    
    h3 {
      margin-top: 0;
      margin-bottom: 16px;
      color: #333;
    }
    
    .detail-row {
      display: flex;
      margin-bottom: 12px;
    }
    
    .label {
      flex: 0 0 120px;
      font-weight: 500;
      color: #666;
    }
    
    .value {
      color: #333;
      font-weight: 600;
    }
    
    .instructions {
      padding: 24px;
      background-color: #f5f5f5;
      font-size: 14px;
      line-height: 1.5;
      color: #555;
    }
    
    .instructions p {
      margin: 0 0 8px 0;
    }
    
    .action-buttons {
      padding: 16px 24px;
      display: flex;
      justify-content: center;
    }
    
    .btn {
      padding: 12px 24px;
      border-radius: 4px;
      border: none;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .btn.primary {
      background-color: #3366CC;
      color: white;
    }
    
    .btn.primary:hover {
      background-color: #2855b0;
    }
    
    @media (max-width: 768px) {
      .detail-row {
        flex-direction: column;
      }
      
      .label {
        margin-bottom: 4px;
      }
    }
  `]
})
export class BookingSuccessComponent {
  @Input() booking: Booking | null = null;
  @Input() slot: ParkingSlot | null = null;
  @Input() floor: Floor | null = null;
  
  @Output() done = new EventEmitter<void>();
  
  constructor() {}
  
  calculateDuration(): string {
    if (!this.booking) {
      return '';
    }
    
    const startTime = this.booking.startTime;
    const endTime = this.booking.endTime;
    const diffMs = endTime.getTime() - startTime.getTime();
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
  
  onDone(): void {
    this.done.emit();
  }
}