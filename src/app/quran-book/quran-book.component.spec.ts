import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuranBookComponent } from './quran-book.component';

describe('QuranBookComponent', () => {
  let component: QuranBookComponent;
  let fixture: ComponentFixture<QuranBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuranBookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuranBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
