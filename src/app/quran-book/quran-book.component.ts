import { Component, ElementRef, ViewChild } from '@angular/core';
import { QuranService } from '../services/quran.service';
import { TajweedViewerComponent } from './tajweed-viewer/tajweed-viewer.component';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

declare var Tajweed: any;

@Component({
  selector: 'app-quran-book',
  imports: [CommonModule,TajweedViewerComponent],
  templateUrl: './quran-book.component.html',
  styleUrl: './quran-book.component.css'
})


export class QuranBookComponent {
  surah: any;
  parsedHtml: SafeHtml = '';
  constructor(private quranService: QuranService,private sanitizer: DomSanitizer,private httpclient : HttpClient) {}
  @ViewChild('quranPage', { static: true }) quranPage!: ElementRef;
  tajweedCorrectness: { [key: string]: boolean } = {
  "1-1-1": true,
  "1-1-2": false,
  "1-1-3": true,
  "1-1-4": false,
  "1-1-5": true,
}
  ngOnInit(): void 
  {
     const stored = localStorage.getItem('tajweedCorrectness');
    const correctnessDict = stored ? JSON.parse(stored) : {};
    const x = "بِسْمِ [h:1[ٱ]للَّهِ [h:2[ٱ][l[ل]رَّحْمَ[n[ـٰ]نِ [h:3[ٱ][l[ل]رَّح[p[ِي]مِ";
    const parseTajweed = new Tajweed();
    const htmlString = parseTajweed.parse(x,true,1,1,correctnessDict)
    this.parsedHtml = this.sanitizer.bypassSecurityTrustHtml(htmlString);
    //this.getQuranPage();

  }
  getQuranPage() {
  this.httpclient.get("https://api.alquran.cloud/v1/page/1/quran-tajweed")
    .subscribe({
      next: (response: any) => {
        const parseTajweed = new Tajweed();
        var htmlString ='';
        for (const item of response.data.ayahs) {
          htmlString+= parseTajweed.parse(item.text, true,item.number,item.surah.number,this.tajweedCorrectness);
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

onTajweedClick(id: string | null) {
   if (!id) return;

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
  }

  console.log(`Toggled ${id} → ${newValue}`);
}
}
