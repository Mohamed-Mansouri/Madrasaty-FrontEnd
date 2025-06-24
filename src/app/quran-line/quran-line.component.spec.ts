import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuranLineComponent } from './quran-line.component';

describe('QuranLineComponent', () => {
  let component: QuranLineComponent;
  let fixture: ComponentFixture<QuranLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuranLineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuranLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
