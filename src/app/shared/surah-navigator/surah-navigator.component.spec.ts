import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurahNavigatorComponent } from './surah-navigator.component';

describe('SurahNavigatorComponent', () => {
  let component: SurahNavigatorComponent;
  let fixture: ComponentFixture<SurahNavigatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurahNavigatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurahNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
