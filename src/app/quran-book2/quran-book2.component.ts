import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
interface Ayah {
  number: number;
  text: string;
}

declare var Tajweed: any;

@Component({
  selector: 'app-quran-book2',
  imports: [CommonModule,FormsModule],
  templateUrl: './quran-book2.component.html',
  styleUrl: './quran-book2.component.css'
})
export class QuranBook2Component {
ayahs: Ayah[] = [];
parsedHtml: SafeHtml = '';
  constructor(private http: HttpClient,private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
  this.http.get(`assets/QuranByLineAndAyah.json`).subscribe({
    next: (response: any[]) => {
      const pageEntries = response.filter(item => item.page === 1);
      const parseTajweed = new Tajweed();
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

      this.parsedHtml = this.sanitizer.bypassSecurityTrustHtml(htmlString);
    },
    error: (err) => {
      console.error('Failed to load ayah:', err);
    }
  });
}


  splitToLetters(text: string): string[] {
    return [...text]; // handles Arabic ligatures correctly
  }
}
