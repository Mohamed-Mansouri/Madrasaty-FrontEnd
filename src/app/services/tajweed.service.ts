// src/app/services/tajweed.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AyahTajweedData, PageLine } from '../models/TajweedID';

@Injectable({
  providedIn: 'root',
})
export class TajweedService {
  constructor(private http: HttpClient) {}

  loadTajweedAnnotations(): Observable<AyahTajweedData[]> {
    return this.http.get<AyahTajweedData[]>('assets/tajweed_annotations.json').pipe(
      catchError((err) => {
        console.error('Failed to load tajweed annotations:', err);
        return throwError(() => err);
      })
    );
  }

  injectTajweedIntoPageLines(
    pageLines: PageLine[],
    annotations: AyahTajweedData[],
    loader: (tajweed: AyahTajweedData[], ayas: any[], surahId: number) => void
  ): PageLine[] {
    for (const line of pageLines) {
      const surahId = line.surahid;
      loader(annotations, line.ayas, surahId);
    }
    return pageLines;
  }
}
