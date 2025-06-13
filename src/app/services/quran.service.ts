import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuranService {
  constructor(private http: HttpClient) {}

  loadSurah(surahNumber: number): Observable<any> {
    const quran$ = this.http.get<any>('assets/Quran.json');
    const tajweed$ = this.http.get<any>('assets/tajweed.json');

    return forkJoin([quran$, tajweed$]).pipe(
      map(([quranData, tajweedData]) => {
        const surah = quranData.data.surahs.find((s: any) => s.number === surahNumber);
        if (!surah) throw new Error('Surah not found');

        for (const ayah of surah.ayahs) {
          const annotationEntry = tajweedData.find((a: any) =>
            a.surah === surahNumber && a.ayah === ayah.numberInSurah
          );

          if (annotationEntry) {
            ayah.annotations = annotationEntry.annotations;
          } else {
            ayah.annotations = [];
          }
        }

        return surah;
      })
    );
  }
}
