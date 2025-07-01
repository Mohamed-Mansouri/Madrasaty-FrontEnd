import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AyahChar, TajweedRuleInfo } from '../../models/TajweedID';
import { SharedService } from '../../services/notificationService';
import { Subscription } from 'rxjs';
import { TajweedRuleService } from '../../services/tajweedinfo.service';
import { FormsModule } from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-tajweed-eval',
  imports: [MatRadioModule, FormsModule,CommonModule],
  templateUrl: './tajweed-eval.component.html',
  styleUrl: './tajweed-eval.component.css'
})
export class TajweedEvalComponent {
    selectedTajweedChar : AyahChar ;
    TajweedInfos : TajweedRuleInfo[];
    private sub: Subscription;
    selectedRule : TajweedRuleInfo ;
    selectederror : string;
    constructor(private sharedService: SharedService,private TrService:TajweedRuleService) {}

  ngOnInit(): void {
    
    this.TrService.loadTajweedInfos().subscribe({
                      next: data => {
                      this.TajweedInfos = data;               
                      },
                      error: err => {
                        console.error('Failed to load tajweed infos:', err);
                      }
                    });

    this.sub = this.sharedService.ayahSelected$.subscribe(char => {
      this.selectedTajweedChar = char;
      this.selectedRule  = this.TajweedInfos.find(x=>x.type == this.selectedTajweedChar?.ruleClass);
      console.log(this.selectedRule);
    });

     
   
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }


}
