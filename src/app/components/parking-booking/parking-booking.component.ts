import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParkingService } from '../../services/parking.service';
import { Floor } from '../../models/floor.model';
import { ParkingSlot } from '../../models/parking-slot.model';
import { Booking } from '../../models/booking.model';
import { FloorSelectorComponent } from '../floor-selector/floor-selector.component';
import { DateTimePickerComponent } from '../date-time-picker/date-time-picker.component';
import { ParkingGridComponent } from '../parking-grid/parking-grid.component';
import { BookingFormComponent } from '../booking-form/booking-form.component';
import { BookingSuccessComponent } from '../booking-success/booking-success.component';

@Component({
  selector: 'app-parking-booking',
  standalone: true,
  imports: [
    CommonModule,
    FloorSelectorComponent,
    DateTimePickerComponent,
    ParkingGridComponent,
    BookingFormComponent,
    BookingSuccessComponent
  ],
  template: `
    <div class="parking-booking-container">
      <header class="booking-header">
        <h1>Parking Spot Booking</h1>
        <p class="subheader">Select a floor, choose your time, and book your spot</p>
      </header>
      
      <div class="booking-flow">
        <div class="step-indicator">
          <div 
            class="step" 
            [class.active]="currentStep >= 1"
            [class.completed]="currentStep > 1"
          >
            1. Select Floor
          </div>
          <div class="step-connector"></div>
          <div 
            class="step" 
            [class.active]="currentStep >= 2"
            [class.completed]="currentStep > 2"
          >
            2. Choose Date/Time
          </div>
          <div class="step-connector"></div>
          <div 
            class="step" 
            [class.active]="currentStep >= 3"
            [class.completed]="currentStep > 3"
          >
            3. Select Slot
          </div>
          <div class="step-connector"></div>
          <div 
            class="step" 
            [class.active]="currentStep >= 4"
          >
            4. Confirm
          </div>
        </div>
        
        <div class="booking-content">
          <!-- Floor Selector -->
          <app-floor-selector
            (floorSelected)="onFloorSelected($event)"
          ></app-floor-selector>
          
          <!-- Date & Time Picker -->
          <app-date-time-picker
            (dateRangeChanged)="onDateRangeChanged($event)"
          ></app-date-time-picker>
          
          <!-- Parking Grid -->
          <app-parking-grid
            *ngIf="availableSlots && availableSlots.length > 0"
            [slots]="availableSlots"
            [floor]="selectedFloor"
            (slotSelected)="onSlotSelected($event)"
          ></app-parking-grid>
          
          <!-- Booking Form -->
          <app-booking-form
            *ngIf="selectedSlot && currentStep === 4"
            [slot]="selectedSlot"
            [floor]="selectedFloor"
            [startTime]="startDate"
            [endTime]="endDate"
            (confirm)="onBookingConfirm($event)"
            (cancel)="onBookingCancel()"
          ></app-booking-form>
        </div>
      </div>
    </div>
    
    <!-- Success Modal -->
    <app-booking-success
      *ngIf="showSuccessModal"
      [booking]="confirmedBooking"
      [slot]="selectedSlot"
      [floor]="selectedFloor"
      (done)="onSuccessDone()"
    ></app-booking-success>
  `,
  styles: [`
    .parking-booking-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }
    
    .booking-header {
      text-align: center;
      margin-bottom: 32px;
    }
    
    h1 {
      font-size: 32px;
      margin: 0;
      color: #333;
    }
    
    .subheader {
      font-size: 16px;
      color: #666;
      margin: 8px 0 0 0;
    }
    
    .booking-flow {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .step-indicator {
      display: flex;
      align-items: center;
      padding: 16px;
      background-color: #f5f5f5;
      border-bottom: 1px solid #eee;
    }
    
    .step {
      padding: 8px 16px;
      border-radius: 16px;
      font-size: 14px;
      font-weight: 500;
      color: #666;
      background-color: #e0e0e0;
      transition: all 0.3s ease;
    }
    
    .step.active {
      background-color: #3366CC;
      color: white;
    }
    
    .step.completed {
      background-color: #4CAF50;
      color: white;
    }
    
    .step-connector {
      flex: 1;
      height: 2px;
      background-color: #e0e0e0;
      margin: 0 8px;
    }
    
    .booking-content {
      padding: 24px;
    }
    
    @media (max-width: 768px) {
      .step-indicator {
        display: none; /* Hide on mobile to save space */
      }
      
      h1 {
        font-size: 24px;
      }
      
      .subheader {
        font-size: 14px;
      }
    }
  `]
})
export class ParkingBookingComponent implements OnInit {
  // State variables
  currentStep: number = 1;
  selectedFloor: Floor | null = null;
  availableSlots: ParkingSlot[] = [];
  selectedSlot: ParkingSlot | null = null;
  startDate: Date | null = null;
  endDate: Date | null = null;
  
  // Confirmation state
  confirmedBooking: Booking | null = null;
  showSuccessModal: boolean = false;
  
  constructor(private parkingService: ParkingService) {}
  
  ngOnInit(): void {
    // Get initially selected floor
    this.parkingService.getSelectedFloor().subscribe(floor => {
      this.selectedFloor = floor;
      this.updateAvailableSlots();
    });
  }
  
  updateAvailableSlots(): void {
    if (!this.selectedFloor || !this.startDate || !this.endDate) {
      this.availableSlots = [];
      return;
    }
    
    this.parkingService.getAvailableSlots(
      this.selectedFloor.id,
      this.startDate,
      this.endDate
    ).subscribe(slots => {
      this.availableSlots = slots;
      
      // If we previously selected a slot, check if it's still available
      if (this.selectedSlot) {
        const stillAvailable = this.availableSlots.find(
          slot => slot.id === this.selectedSlot?.id && slot.isAvailable
        );
        
        if (!stillAvailable) {
          this.selectedSlot = null;
          this.currentStep = 3; // Go back to slot selection
        }
      }
    });
  }
  
  onFloorSelected(floor: Floor): void {
    this.selectedFloor = floor;
    this.selectedSlot = null;
    this.updateAvailableSlots();
    this.currentStep = Math.max(this.currentStep, 2);
  }
  
  onDateRangeChanged(dateRange: {start: Date, end: Date}): void {
    this.startDate = dateRange.start;
    this.endDate = dateRange.end;
    this.selectedSlot = null;
    this.updateAvailableSlots();
    this.currentStep = Math.max(this.currentStep, 3);
  }
  
  onSlotSelected(slot: ParkingSlot): void {
    this.selectedSlot = slot;
    this.currentStep = 4;
  }
  
  onBookingConfirm(bookingData: Booking): void {
    this.parkingService.bookSlot({
      slotId: bookingData.slotId,
      floorId: bookingData.floorId,
      startTime: bookingData.startTime,
      endTime: bookingData.endTime,
      customerName: bookingData.customerName,
      vehicleNumber: bookingData.vehicleNumber
    }).subscribe(booking => {
      this.confirmedBooking = booking;
      this.showSuccessModal = true;
    });
  }
  
  onBookingCancel(): void {
    this.selectedSlot = null;
    this.currentStep = 3;
  }
  
  onSuccessDone(): void {
    // Reset booking flow
    this.showSuccessModal = false;
    this.confirmedBooking = null;
    this.selectedSlot = null;
    this.currentStep = 1;
    this.startDate = null;
    this.endDate = null;
    this.availableSlots = [];
  }
}