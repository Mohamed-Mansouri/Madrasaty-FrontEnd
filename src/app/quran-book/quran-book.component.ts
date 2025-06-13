import { Component } from '@angular/core';
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

  ngOnInit(): void 
  {
    const x = "بِسْمِ [h:1[ٱ]للَّهِ [h:2[ٱ][l[ل]رَّحْمَ[n[ـٰ]نِ [h:3[ٱ][l[ل]رَّح[p[ِي]مِ";
    const parseTajweed = new Tajweed();
    const htmlString = parseTajweed.parse(x,true,1,1)
    //this.parsedHtml = this.sanitizer.bypassSecurityTrustHtml(htmlString);
    this.getQuranPage();

  }
  getQuranPage() {
  this.httpclient.get("https://api.alquran.cloud/v1/page/1/quran-tajweed")
    .subscribe({
      next: (response: any) => {
        const parseTajweed = new Tajweed();
        var htmlString ='';
        for (const item of response.data.ayahs) {
          htmlString+= parseTajweed.parse(item.text, true,item.number,item.surah.number);
          htmlString+='۞';
          }
          this.parsedHtml = this.sanitizer.bypassSecurityTrustHtml(htmlString);
        
      },
      error: (err) => {
        console.error('Failed to load ayah:', err);
      }
    });
}

  
}
