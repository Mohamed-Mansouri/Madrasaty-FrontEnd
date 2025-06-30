// shared.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AyahChar } from '../models/TajweedID';

@Injectable({ providedIn: 'root' })
export class SharedService {
  private ayahSelectedSubject = new Subject<AyahChar>();
  ayahSelected$ = this.ayahSelectedSubject.asObservable();

  selectAyah(AyahChar: AyahChar): void {
    this.ayahSelectedSubject.next(AyahChar);
  }
}
