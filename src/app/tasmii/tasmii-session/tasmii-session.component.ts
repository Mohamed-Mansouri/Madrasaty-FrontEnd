import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuranBook2Component } from '../../quran-book2/quran-book2.component';
import { TajweedEvalComponent } from '../../evaluation/tajweed-eval/tajweed-eval.component';
import { AyahChar } from '../../models/TajweedID';
import { SharedService } from '../../services/notificationService';

@Component({
  selector: 'app-tasmii-session',
  imports: [FormsModule,CommonModule,QuranBook2Component,TajweedEvalComponent],
  templateUrl: './tasmii-session.component.html',
  styleUrl: './tasmii-session.component.css'
})
export class TasmiiSessionComponent {
/**
 *
 */
constructor(private sharedService: SharedService) {

}

selectedchar : AyahChar;
  OnCharClick(char:AyahChar){
  this.selectedchar = char;
  console.log(char);
  }

 reset():void
 {
//this.sharedService.reset()
 }
 
 
}
