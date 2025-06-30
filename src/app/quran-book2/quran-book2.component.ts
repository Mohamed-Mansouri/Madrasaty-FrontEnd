import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { QuranLineComponent } from '../quran-line/quran-line.component';
import { Ayah, AyahChar, AyahTajweedData, PageLine } from '../models/TajweedID';
import { SurahNavigatorComponent } from '../shared/surah-navigator/surah-navigator.component';

declare var Tajweed: any;

@Component({
  selector: 'app-quran-book2',
  imports: [CommonModule,FormsModule,QuranLineComponent,SurahNavigatorComponent],
  templateUrl: './quran-book2.component.html',
  styleUrl: './quran-book2.component.css'
})
export class QuranBook2Component {
ayahs: Ayah[] = [];
pageLines: PageLine[] = [];
parsedHtml: SafeHtml = '';
pageNumber : number = 1 ; 
surahMin : number = 1 ; 
surahMax : number = 604 ; 
@Output() OnCharClick = new EventEmitter<AyahChar>();
  constructor(private http: HttpClient,private sanitizer: DomSanitizer) {}

  ngOnInit(): void {

      this.loadSurahPage();
 
  
}

mode: 'ayah' | 'char' = 'ayah';
activeAyah: number | null = null;
ayahNotes: { [key: number]: string } = {};

toggleMode() {
  this.mode = this.mode === 'ayah' ? 'char' : 'ayah';
  this.applyModeHighlighting();
}

closeNoteModal() {
  this.activeAyah = null;
}
loadSurahPage()
{
   this.http.get(`assets/quran_lines_with_text2.json`).subscribe({
    next: (response: PageLine[]) => {
      let tempPagelines = response.filter(item => item.page === this.pageNumber)
      //this.pageLines = response.filter(item => item.page === 3);

      let tajweed : AyahTajweedData[];
       this.http.get<AyahTajweedData[]>('assets/tajweed_annotations.json').subscribe({
                      next: data => {
                        tajweed = data;
                         tempPagelines.forEach(line=>{
                        let surahid = line.surahid;
                        this.loadTajweedIntoAyahs(tajweed,line.ayas,surahid); 
                        this.pageLines = tempPagelines;
                          })
                      },
                      error: err => {
                        console.error('Failed to load tajweed annotations:', err);
                      }
                    });
    },
    error: (err) => {
      console.error('Failed to load ayah:', err);
    }
  });
}
applyModeHighlighting() {
  setTimeout(() => {
    document.querySelectorAll('.ayah').forEach((el: Element) => {
      el.removeEventListener('mouseenter', null);
      el.removeEventListener('click', null);

      if (this.mode === 'ayah') {
        el.addEventListener('mouseenter', () => {
          (el as HTMLElement).style.backgroundColor = '#ffe5e5';
        });
        el.addEventListener('mouseleave', () => {
          (el as HTMLElement).style.backgroundColor = '';
        });
        el.addEventListener('click', () => {
          const ayahNum = (el as HTMLElement).getAttribute('data-ayah');
          this.activeAyah = ayahNum ? +ayahNum : null;
        });
      } else {
        (el as HTMLElement).style.backgroundColor = '';
      }
    });
  }, 100);
}

loadTajweedIntoAyahs(data: AyahTajweedData[], ayahs: Ayah[],surahid:number) {

  ayahs.forEach(ayah => {
    let match = data.find(d => d.surah === surahid && d.ayah === ayah.number);
    if (match) {
      ayah.annotations = match.annotations;
    }
  });
  
}
  decrement() {
    if (this.pageNumber > this.surahMin) {
      this.pageNumber--;
      this.loadSurahPage();

    }
  }

  increment() {
    if (this.pageNumber < this.surahMax) {
      this.pageNumber++;
      this.loadSurahPage();

    }
  }
  handleManualInput(inputValue: number) {
  const page = Math.max(this.surahMin, Math.min(inputValue, this.surahMax));
  this.pageNumber = page;
  this.loadSurahPage(); 
}
}

