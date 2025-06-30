import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-surah-navigator',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule ],
  templateUrl: './surah-navigator.component.html',
  styleUrl: './surah-navigator.component.css'
})
export class SurahNavigatorComponent {
    @Input() value : number ;
    @Input() min : number ; 
    @Input() max : number ;
    @Output() Ondecrement = new EventEmitter<void>();
    @Output() Onincrement = new EventEmitter<void>();
    @Output() Onmanual = new EventEmitter<number>(); // Optional for input typing

onInputChange(newValue: number) {
  this.Onmanual.emit(newValue); 
}


}
