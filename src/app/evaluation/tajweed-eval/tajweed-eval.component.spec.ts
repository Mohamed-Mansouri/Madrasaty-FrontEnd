import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TajweedEvalComponent } from './tajweed-eval.component';

describe('TajweedEvalComponent', () => {
  let component: TajweedEvalComponent;
  let fixture: ComponentFixture<TajweedEvalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TajweedEvalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TajweedEvalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
