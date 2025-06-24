import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
declare global {
  interface Window {
    highlightAyah: (number: number) => void;
  }
}
@Component({
  selector: 'app-quran-line',
  templateUrl: './quran-line.component.html',
  imports:[FormsModule,CommonModule],
  styleUrls: ['./quran-line.component.css']
})
export class QuranLineComponent {
   @Input() line: any; // expects one line from the JSON
   @Input() tajweedMap: Record<number, { [ayahNumber: number]: { [index: number]: string } }> = {};
  html: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) {}
ngOnInit(): void {
    window.highlightAyah = (number: number) => {
      console.log(number)
      this.highlightAyah(number);
    };
  }

  highlightAyah(number: number): void {
    // Remove any existing highlights
    document.querySelectorAll('.letter.highlight').forEach(el => {
      el.classList.remove('highlight');
    });

    // Highlight all matching letters
    document.querySelectorAll(`.letter.ayah-${number}`).forEach(el => {
      el.classList.add('highlight');
    });
  }

  /*ngOnChanges(): void {
    if (this.line) {
      let html = '';

      for (const ayah of this.line.ayas) {
        if (ayah.number === -1) {
          html += `<div class="suraHeaderFrame">${ayah.text}</div>`;
        } else if (ayah.number === -2) {
          html += `<div class="basmalah">${ayah.text}</div>`;
        } else {
          html += this.parseAyah(ayah);
        }
      }

      this.html = this.sanitizer.bypassSecurityTrustHtml(html);
    }
  }*/

  private parseAyah(ayah: any): string {
    const words = ayah.text.trim().split(/\s+/);
    const wordHtml = words.map(word => {
      const wrapped = [...word].map(char =>
        /[\u0600-\u06FF]/.test(char)
          ? `<span class="letter ayah-${ayah.number}">${char}</span>`
          : char
      ).join('');
      return wrapped;
    });

    const ayahText = wordHtml.join(' ');
    const number = ayah.isend
      ? `<span class="ayah-number" onclick="window.highlightAyah(${ayah.number})" >﴿${ayah.number}﴾</span>`
      : '';

    return `<span class="ayah-group">${ayahText}${number}</span>`;
  }
  splitAyahChars(ayah: any): { char: string, index: number, ruleClass?: string }[] {
  const chars = [...ayah.text];
  const rules = this.tajweedMap[this.line?.surahid]?.[ayah.number] || {};
  
  let chartst =  chars.map((char, i) => ({
    char,
    index: i,
    ruleClass: rules[i]?'red':'' // e.g. 'madd_2'
  }));

  console.log(chartst);
  return chartst;
}
}
