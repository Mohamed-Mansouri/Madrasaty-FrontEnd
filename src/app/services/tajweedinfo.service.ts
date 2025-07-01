// src/app/services/tajweed.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AyahTajweedData, PageLine, TajweedRuleInfo } from '../models/TajweedID';

@Injectable({
  providedIn: 'root',
})
export class TajweedRuleService {
  constructor(private http: HttpClient) {}

  loadTajweedInfos(): Observable<TajweedRuleInfo[]> {
    return this.http.get<TajweedRuleInfo[]>('assets/RulesDescription.json').pipe(
      catchError((err) => {
        console.error('Failed to load tajweed annotations:', err);
        return throwError(() => err);
      })
    );
  }

}
