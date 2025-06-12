import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParkingSlot, SlotType } from '../../models/parking-slot.model';
import { Floor } from '../../models/floor.model';

@Component({
  selector: 'app-parking-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="parking-grid-container">
      <h3 *ngIf="floor">{{ floor.name }} Parking Map</h3>
      
      <div class="legend">
        <div class="legend-item">
          <div class="slot-indicator available"></div>
          <span>Available</span>
        </div>
        <div class="legend-item">
          <div class="slot-indicator occupied"></div>
          <span>Occupied</span>
        </div>
        <div class="legend-item">
          <div class="slot-indicator handicap"></div>
          <span>Handicap</span>
        </div>
        <div class="legend-item">
          <div class="slot-indicator electric"></div>
          <span>Electric</span>
        </div>
      </div>
      
      <div class="grid" *ngIf="slots && slots.length > 0">
        <div 
          *ngFor="let slot of slots" 
          class="parking-slot"
          [class.available]="slot.isAvailable"
          [class.occupied]="!slot.isAvailable"
          [class.handicap]="slot.type === 'handicap'"
          [class.electric]="slot.type === 'electric'"
          [class.compact]="slot.type === 'compact'"
          [class.selected]="selectedSlot?.id === slot.id"
          (click)="selectSlot(slot)"
        >
          <div class="slot-id">{{ slot.name }}</div>
        </div>
      </div>
      
      <div class="no-slots" *ngIf="!slots || slots.length === 0">
        No parking slots available for this floor.
      </div>
    </div>
  `,
  styles: [`
    .parking-grid-container {
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
    }
    
    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 16px;
      padding: 8px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .slot-indicator {
      width: 16px;
      height: 16px;
      border-radius: 4px;
    }
    
    .slot-indicator.available {
      background-color: #4CAF50;
    }
    
    .slot-indicator.occupied {
      background-color: #F44336;
    }
    
    .slot-indicator.handicap {
      background-color: #2196F3;
    }
    
    .slot-indicator.electric {
      background-color: #9C27B0;
    }
    
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      gap: 8px;
    }
    
    .parking-slot {
      aspect-ratio: 1;
      background-color: #4CAF50;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      color: white;
      font-weight: bold;
    }
    
    .parking-slot:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      z-index: 1;
    }
    
    .parking-slot.occupied {
      background-color: #F44336;
      cursor: not-allowed;
    }
    
    .parking-slot.handicap {
      background-color: #2196F3;
    }
    
    .parking-slot.electric {
      background-color: #9C27B0;
    }
    
    .parking-slot.compact {
      background-color: #FF9800;
    }
    
    .parking-slot.occupied.handicap,
    .parking-slot.occupied.electric,
    .parking-slot.occupied.compact {
      opacity: 0.6;
    }
    
    .parking-slot.selected {
      outline: 4px solid #3366CC;
      z-index: 2;
    }
    
    .slot-id {
      font-size: 14px;
    }
    
    .no-slots {
      padding: 24px;
      text-align: center;
      background-color: #f5f5f5;
      border-radius: 4px;
      color: #666;
    }
    
    @media (max-width: 768px) {
      .grid {
        grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
      }
      
      .slot-id {
        font-size: 12px;
      }
    }
  `]
})
export class ParkingGridComponent implements OnInit, OnChanges {
  @Input() slots: ParkingSlot[] = [];
  @Input() floor: Floor | null = null;
  
  @Output() slotSelected = new EventEmitter<ParkingSlot>();
  
  selectedSlot: ParkingSlot | null = null;
  
  constructor() {}
  
  ngOnInit(): void {}
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['slots'] || changes['floor']) {
      // Reset selected slot when floor or slots change
      this.selectedSlot = null;
    }
  }
  
  selectSlot(slot: ParkingSlot): void {
    if (!slot.isAvailable) {
      return; // Cannot select unavailable slots
    }
    
    this.selectedSlot = slot;
    this.slotSelected.emit(slot);
  }
}