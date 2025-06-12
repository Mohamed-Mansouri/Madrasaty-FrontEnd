import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParkingService } from '../../services/parking.service';
import { Floor } from '../../models/floor.model';

@Component({
  selector: 'app-floor-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="floor-selector">
      <h3>Select Floor</h3>
      <div class="floor-buttons">
        <button
          *ngFor="let floor of floors"
          [class.active]="floor.id === selectedFloor?.id"
          (click)="selectFloor(floor)"
          class="floor-button"
        >
          {{ floor.name }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .floor-selector {
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
    
    .floor-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .floor-button {
      padding: 10px 16px;
      background-color: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
      color: #444;
    }
    
    .floor-button:hover {
      background-color: #eaeaea;
    }
    
    .floor-button.active {
      background-color: #3366CC;
      color: white;
      border-color: #3366CC;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    @media (max-width: 768px) {
      .floor-buttons {
        flex-direction: column;
      }
      
      .floor-button {
        width: 100%;
        text-align: left;
      }
    }
  `]
})
export class FloorSelectorComponent implements OnInit {
  floors: Floor[] = [];
  selectedFloor: Floor | null = null;
  
  @Output() floorSelected = new EventEmitter<Floor>();
  
  constructor(private parkingService: ParkingService) {}
  
  ngOnInit(): void {
    this.parkingService.getFloors().subscribe(floors => {
      this.floors = floors;
      if (floors.length > 0 && !this.selectedFloor) {
        this.selectFloor(floors[0]);
      }
    });
    
    this.parkingService.getSelectedFloor().subscribe(floor => {
      this.selectedFloor = floor;
    });
  }
  
  selectFloor(floor: Floor): void {
    this.parkingService.setSelectedFloor(floor);
    this.floorSelected.emit(floor);
  }
}