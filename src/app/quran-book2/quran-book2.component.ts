import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { QuranLineComponent } from '../quran-line/quran-line.component';
import { Ayah, AyahTajweedData, PageLine } from '../models/TajweedID';

declare var Tajweed: any;

@Component({
  selector: 'app-quran-book2',
  imports: [CommonModule,FormsModule,QuranLineComponent],
  templateUrl: './quran-book2.component.html',
  styleUrl: './quran-book2.component.css'
})
export class QuranBook2Component {
ayahs: Ayah[] = [];
pageLines: PageLine[] = [];
parsedHtml: SafeHtml = '';
  constructor(private http: HttpClient,private sanitizer: DomSanitizer) {}

  ngOnInit(): void {


  this.http.get(`assets/quran_lines_with_text2.json`).subscribe({
    next: (response: PageLine[]) => {
      let tempPagelines = response.filter(item => item.page === 3)
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

}
