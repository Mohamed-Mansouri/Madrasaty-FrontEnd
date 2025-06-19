import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuranBook2Component } from './quran-book2.component';

describe('QuranBook2Component', () => {
  let component: QuranBook2Component;
  let fixture: ComponentFixture<QuranBook2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuranBook2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuranBook2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
