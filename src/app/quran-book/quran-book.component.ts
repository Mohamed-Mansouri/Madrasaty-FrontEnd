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
    //const x = "۞ ٱللَّهُ نُورُ [h:9421[ٱ][l[ل]سَّمَ[n[ـٰ]و[n[َٲ]تِ وَ[h:177[ٱ]لْأَرْضِ‌ۚ مَثَلُ نُورِه[n[ِۦ] كَمِشْكَ[s[و][n[ٲ][f:9422[ةٍ ف]ِيهَا مِصْبَاحٌ‌ۖ [h:9423[ٱ]لْمِصْبَاحُ فِى زُجَاجَةٍ‌ۖ [h:9424[ٱ][l[ل]زُّجَاجَةُ كَأَ[g[نّ]َهَا كَوْكَ[f:9425[بٌ د]ُرِّ[a:9426[ىٌّ ي]ُوقَدُ مِ[f:9427[ن ش]َجَرَ[a:9428[ةٍ م]ُّبَ[n[ـٰ]رَكَ[f:9429[ةٍ ز]َيْتُونَ[u:9430[ةٍ ل]َّا شَرْقِيَّ[a:9431[ةٍ و]َلَا غَرْبِيَّ[a:9432[ةٍ ي]َكَادُ زَيْتُهَا يُض[o[ِى]ٓءُ وَلَوْ لَمْ تَمْسَسْهُ نَا[a:9433[رٌ‌ۚ ن]ُّورٌ عَلَىٰ نُو[a:9434[رٍ‌ۗ ي]َهْدِى [h:2084[ٱ]للَّهُ لِنُورِه[n[ِۦ] م[a:476[َن ي]َش[o[َا]ٓءُ‌ۚ وَيَضْرِبُ [h:7110[ٱ]للَّهُ [h:6948[ٱ]لْأَمْثَ[n[ـٰ]لَ لِل[g[نّ]َاسِ‌ۗ وَ[h:72[ٱ]للَّهُ بِكُلِّ شَىْءٍ عَل[p[ِي]مٌ";
   // const parseTajweed = new Tajweed();
   // const htmlString = parseTajweed.parse(x,true)
    //this.parsedHtml = this.sanitizer.bypassSecurityTrustHtml(htmlString);
    this.getQuranPage();

  }
  getQuranPage() {
  this.httpclient.get("https://api.alquran.cloud/v1/ayah/262/quran-tajweed")
    .subscribe({
      next: (response: any) => {
        const parseTajweed = new Tajweed();
        const htmlString = parseTajweed.parse(response.data.text, true);
        this.parsedHtml = this.sanitizer.bypassSecurityTrustHtml(htmlString);
      },
      error: (err) => {
        console.error('Failed to load ayah:', err);
      }
    });
}

  
}
