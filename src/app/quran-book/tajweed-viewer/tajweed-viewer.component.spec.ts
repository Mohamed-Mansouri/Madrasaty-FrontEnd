import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TajweedViewerComponent } from './tajweed-viewer.component';

describe('TajweedViewerComponent', () => {
  let component: TajweedViewerComponent;
  let fixture: ComponentFixture<TajweedViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TajweedViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TajweedViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
