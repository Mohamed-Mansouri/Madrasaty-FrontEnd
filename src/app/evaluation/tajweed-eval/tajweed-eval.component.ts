import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AyahChar } from '../../models/TajweedID';
import { SharedService } from '../../services/notificationService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tajweed-eval',
  imports: [],
  templateUrl: './tajweed-eval.component.html',
  styleUrl: './tajweed-eval.component.css'
})
export class TajweedEvalComponent {
    selectedTajweedChar : AyahChar ;
    private sub: Subscription;
    constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.sub = this.sharedService.ayahSelected$.subscribe(num => {
      this.selectedTajweedChar = num;
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
