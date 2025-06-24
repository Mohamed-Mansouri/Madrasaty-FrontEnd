import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { QuranLineComponent } from '../quran-line/quran-line.component';
interface Ayah {
  number: number;
  text: string;
}

declare var Tajweed: any;

@Component({
  selector: 'app-quran-book2',
  imports: [CommonModule,FormsModule,QuranLineComponent],
  templateUrl: './quran-book2.component.html',
  styleUrl: './quran-book2.component.css'
})
export class QuranBook2Component {
ayahs: Ayah[] = [];
pageLines: any[] = [];
parsedHtml: SafeHtml = '';
  constructor(private http: HttpClient,private sanitizer: DomSanitizer) {}

  ngOnInit(): void {

    this.http.get<any>('assets/tajweed.json').subscribe({
    next: data => {
      this.loadTajweedAnnotations(data);
    },
    error: err => {
      console.error('Failed to load tajweed annotations:', err);
    }
  });

  this.http.get(`assets/Quran230625.json`).subscribe({
    next: (response: any[]) => {
      this.pageLines = response.filter(item => item.page === 354);
      /*const parseTajweed = new Tajweed();
      let htmlString = '';

      for (const line of pageEntries) {
        htmlString += `
          <div class="line">
        `;

        for (const ayahpart of line.ayas) {
          htmlString += parseTajweed.ParseAyah(ayahpart);
        }

        htmlString += `</div>\n`;
      }

      this.parsedHtml = this.sanitizer.bypassSecurityTrustHtml(htmlString);*/
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
tajweedMap: Record<number, { [ayah: number]: { [index: number]: string } }> = {};
loadTajweedAnnotations(data: any[]) {
  for (const entry of data) {
    const surah = entry.surah;
    const ayah = entry.ayah;

    if (!this.tajweedMap[surah]) this.tajweedMap[surah] = {};
    if (!this.tajweedMap[surah][ayah]) this.tajweedMap[surah][ayah] = {};

    for (const ann of entry.annotations) {
      for (let i = ann.start; i <= ann.end; i++) {
        this.tajweedMap[surah][ayah][i] = ann.rule;
      }
    }
  }
}

}
