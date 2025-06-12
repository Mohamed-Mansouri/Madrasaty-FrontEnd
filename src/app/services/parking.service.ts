import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Floor } from '../models/floor.model';
import { ParkingSlot, SlotType } from '../models/parking-slot.model';
import { Booking, BookingStatus } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {
  // Mock data for floors
  private floors: Floor[] = [
    { id: 1, name: 'Ground Floor', level: 0, totalSlots: 20 },
    { id: 2, name: 'Level 1', level: 1, totalSlots: 30 },
    { id: 3, name: 'Level 2', level: 2, totalSlots: 25 }
  ];

  // Mock data for slots
  private slots: ParkingSlot[] = [];

  // Mock data for bookings
  private bookings: Booking[] = [];

  // Behavior subjects
  private floorsSubject = new BehaviorSubject<Floor[]>(this.floors);
  private slotsSubject = new BehaviorSubject<ParkingSlot[]>(this.slots);
  private bookingsSubject = new BehaviorSubject<Booking[]>(this.bookings);
  private selectedFloorSubject = new BehaviorSubject<Floor>(this.floors[0]);

  constructor() {
    this.initializeSlots();
  }

  // Initialize mock slots data
  private initializeSlots(): void {
    let slotId = 1;
    
    // Create slots for each floor
    this.floors.forEach(floor => {
      const rows = Math.ceil(Math.sqrt(floor.totalSlots));
      const cols = Math.ceil(floor.totalSlots / rows);
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (slotId <= floor.totalSlots) {
            // Assign different slot types
            let type = SlotType.STANDARD;
            if (slotId % 10 === 0) type = SlotType.HANDICAP;
            if (slotId % 7 === 0) type = SlotType.ELECTRIC;
            if (slotId % 5 === 0) type = SlotType.COMPACT;
            
            this.slots.push({
              id: slotId,
              floorId: floor.id,
              name: `${floor.level}${String.fromCharCode(65 + row)}${col + 1}`, // e.g., 0A1, 1B2
              isAvailable: true,
              type,
              position: { row, col }
            });
            slotId++;
          }
        }
      }
    });
    
    this.slotsSubject.next(this.slots);
  }

  // Get all floors
  getFloors(): Observable<Floor[]> {
    return this.floorsSubject.asObservable();
  }

  // Get slots for a specific floor
  getSlotsByFloor(floorId: number): Observable<ParkingSlot[]> {
    return this.slotsSubject.pipe(
      map(slots => slots.filter(slot => slot.floorId === floorId))
    );
  }

  // Set selected floor
  setSelectedFloor(floor: Floor): void {
    this.selectedFloorSubject.next(floor);
  }

  // Get selected floor
  getSelectedFloor(): Observable<Floor> {
    return this.selectedFloorSubject.asObservable();
  }

  // Check if a slot is available for a given time range
  checkSlotAvailability(slotId: number, startTime: Date, endTime: Date): Observable<boolean> {
    return this.bookingsSubject.pipe(
      map(bookings => {
        // Find bookings for this slot that overlap with the requested time range
        const overlappingBookings = bookings.filter(
          booking => 
            booking.slotId === slotId && 
            booking.status !== BookingStatus.CANCELLED &&
            ((booking.startTime <= endTime && booking.endTime >= startTime))
        );
        
        return overlappingBookings.length === 0;
      })
    );
  }

  // Get available slots for a given time range and floor
  getAvailableSlots(floorId: number, startTime: Date, endTime: Date): Observable<ParkingSlot[]> {
    return this.slotsSubject.pipe(
      map(slots => {
        const floorSlots = slots.filter(slot => slot.floorId === floorId);
        const overlappingBookings = this.bookings.filter(
          booking => 
            booking.floorId === floorId && 
            booking.status !== BookingStatus.CANCELLED &&
            ((booking.startTime <= endTime && booking.endTime >= startTime))
        );
        
        // Mark slots as available or not
        return floorSlots.map(slot => {
          const isBooked = overlappingBookings.some(booking => booking.slotId === slot.id);
          return { ...slot, isAvailable: !isBooked };
        });
      })
    );
  }

  // Book a slot
  bookSlot(booking: Omit<Booking, 'id' | 'status'>): Observable<Booking> {
    const newBooking: Booking = {
      ...booking,
      id: this.bookings.length + 1,
      status: BookingStatus.CONFIRMED
    };
    
    this.bookings.push(newBooking);
    this.bookingsSubject.next(this.bookings);
    
    return of(newBooking);
  }

  // Cancel a booking
  cancelBooking(bookingId: number): Observable<boolean> {
    const bookingIndex = this.bookings.findIndex(b => b.id === bookingId);
    if (bookingIndex !== -1) {
      this.bookings[bookingIndex].status = BookingStatus.CANCELLED;
      this.bookingsSubject.next(this.bookings);
      return of(true);
    }
    return of(false);
  }

  // Get all bookings
  getBookings(): Observable<Booking[]> {
    return this.bookingsSubject.asObservable();
  }
}