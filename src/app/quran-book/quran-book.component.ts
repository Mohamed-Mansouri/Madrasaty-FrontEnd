import { Component, ElementRef, input, ViewChild } from '@angular/core';
import { QuranService } from '../services/quran.service';
import { TajweedViewerComponent } from './tajweed-viewer/tajweed-viewer.component';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

declare var Tajweed: any;

@Component({
  selector: 'app-quran-book',
  imports: [CommonModule,FormsModule],
  templateUrl: './quran-book.component.html',
  styleUrl: './quran-book.component.css'
})


export class QuranBookComponent {
  surah: any;
  selectedinfo:any;
  showinfo:boolean;
  parsedHtml: SafeHtml = '';
  tajweedDescriptions:Record<string, string>;
  constructor(private quranService: QuranService,private sanitizer: DomSanitizer,private httpclient : HttpClient) {}
  @ViewChild('quranPage', { static: true }) quranPage!: ElementRef;
  tajweedCorrectness: { [key: string]: boolean } = {
  "1-1-1": true,
  "1-1-2": false,
  "1-1-3": true,
  "1-1-4": false,
  "1-1-5": true,
}
pageId : number = 1 ; ; 
Page : any ; 
//todo : need to implement multiples surahs in one page ! 
  ngOnInit(): void 
  {
     this.httpclient.get<Record<string, any>>('assets/RulesDescription.json')
      .subscribe(data => {
        this.tajweedDescriptions = data;
        console.log(this.tajweedDescriptions);
      });

     const stored = localStorage.getItem('tajweedCorrectness');
    const correctnessDict = stored ? JSON.parse(stored) : {};
    const x = "بِسْمِ [h:1[ٱ]للَّهِ [h:2[ٱ][l[ل]رَّحْمَ[n[ـٰ]نِ [h:3[ٱ][l[ل]رَّح[p[ِي]مِ";
    const parseTajweed = new Tajweed();
    const htmlString = parseTajweed.parse(x,true,1,1,correctnessDict)
   // this.parsedHtml = this.sanitizer.bypassSecurityTrustHtml(htmlString);
    this.LoadQuranPage();

  }
  NextPage()
  {
    this.pageId++ ; 
    this.LoadQuranPage();

  }
  PreviousPage()
  {
    this.pageId-- ; 
    this.LoadQuranPage();

  }

  LoadQuranPage() {
     const stored = localStorage.getItem('tajweedCorrectness');
    const correctnessDict = stored ? JSON.parse(stored) : {};
  this.httpclient.get(`https://api.alquran.cloud/v1/page/${this.pageId}/quran-tajweed`)
    .subscribe({
      next: (response: any) => {
        this.Page = response ; 
        const parseTajweed = new Tajweed();
        var htmlString ='';
        for (const item of response.data.ayahs) {
          htmlString+= parseTajweed.parse(item.text, true,item.number,item.surah.number,correctnessDict);
          htmlString+='۞';
          }
          this.parsedHtml = this.sanitizer.bypassSecurityTrustHtml(htmlString);
        
      },
      error: (err) => {
        console.error('Failed to load ayah:', err);
      }
    });
}

ngAfterViewInit(): void {
  this.quranPage.nativeElement.addEventListener('click', (event: Event) => {
    const target = event.target as HTMLElement;
    if (target.tagName.toLowerCase() === 'tajweed') {
      const id = target.getAttribute('id');
      console.log('Clicked tajweed ID:', id);
      this.onTajweedClick(id); // optional custom method
    }
  });
}
gradeOptions = [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
studentGrade = 20;

currentRating = 0;

setRating(star: number) {
  this.currentRating = star;
}

onTajweedClick(id: string | null) {
  if (!id) return;
  
  this.showinfo=true;
  // Load existing state
  const storageKey = 'tajweedCorrectness';
  const stored = localStorage.getItem(storageKey);
  const correctness: { [key: string]: boolean } = stored ? JSON.parse(stored) : {};

  // Toggle value
  const newValue = !(correctness[id] ?? false);
  correctness[id] = newValue;

  // Save it
  localStorage.setItem(storageKey, JSON.stringify(correctness));

  // Update class in DOM
  const el = document.getElementById(id);
  if (el) {
    el.classList.toggle('correct', newValue);
    el.classList.toggle('incorrect', !newValue);
    this.selectedinfo = this.tajweedDescriptions[el.getAttribute("data-type")];
  }

  console.log(`Toggled ${id} → ${newValue}`);
const input = "1-1-1";
const [surah, ayah, tajweedRuleOcc] = input.split('-').map(Number);

const TajweedInfo = { surah, ayah, tajweedRuleOcc };

console.log(TajweedInfo);
}
}
