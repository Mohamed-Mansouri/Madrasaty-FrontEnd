import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Ayah, TajweedAnnotation, TajweedRule } from '../models/TajweedID';
import { elementAt } from 'rxjs';
@Component({
  selector: 'app-quran-line',
  templateUrl: './quran-line.component.html',
  imports:[FormsModule,CommonModule],
  styleUrls: ['./quran-line.component.css']
})
export class QuranLineComponent {
   @Input() line: any; // expects one line from the JSON
  html: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) {}
ngOnInit(): void {

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



  private parseAyah(ayah: any): string {
    const words = ayah.text2.trim().split(/\s+/);
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
  splitAyahChars(ayah: Ayah): { char: string, index: number, word: number, ruleClass?: string }[] {
  const chartst = [];
  const words = ayah.text2.split(' ');
  let wordIndex = ayah.startwordindex ?? 0;
  let localwordindex = 0;
  let linkedchar : boolean = false ; 
  let linkedmatchrule : TajweedAnnotation ;
  for (const word of words) {
        const chars = [...word]; // split word into graphemes (could use Intl.Segmenter if needed)
        for (let i = 0; i < chars.length; i++) {
          const char = chars[i];
         
          const matchRule = ayah.annotations?.find(x =>
            x.word === wordIndex && (x.start === i || x.end === i)
          );
         
          if(linkedmatchrule && linkedmatchrule.word != wordIndex)
          {
            chartst.push({
            char,
            index: i,
            word: wordIndex,
            ruleClass: linkedmatchrule ? 'red' : ''
          });
            linkedmatchrule = null;
          }else
          {
            chartst.push({
                        char,
                        index: i,
                        word: wordIndex,
                        ruleClass: matchRule ? this.getTajweedClass(matchRule.rule) : ''
                      });
          }

         

          // Optional: if end < start, apply a second rule span (your edge case)
          if (matchRule && matchRule.end < matchRule.start) {
            linkedmatchrule = matchRule;
          }
        }

        // Add space after word if needed
        chartst.push({ char: ' ', index: -1, word: wordIndex, ruleClass: '' });
        localwordindex++;
        wordIndex++;
  }

  return chartst;
}
getTajweedClass(rule: TajweedRule): string {
  switch (rule) {
    case TajweedRule.HamzatWasl:
      return 'hamzat_wasl';
    case TajweedRule.LamShamsiyyah:
      return 'lam_shamsiyyah';
    case TajweedRule.Silent:
      return 'silent';
    case TajweedRule.Madda2:
      return 'madd_2';
    case TajweedRule.Madda246:
      return 'madd_246';
    case TajweedRule.Qalaqah:
      return 'qalaqah';
    case TajweedRule.Ghunnah:
      return 'ghunnah';
    case TajweedRule.Ikhafa:
      return 'ikhafa';
  }
}


}