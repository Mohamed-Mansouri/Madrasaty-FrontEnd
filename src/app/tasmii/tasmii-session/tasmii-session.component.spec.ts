import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasmiiSessionComponent } from './tasmii-session.component';

describe('TasmiiSessionComponent', () => {
  let component: TasmiiSessionComponent;
  let fixture: ComponentFixture<TasmiiSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasmiiSessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasmiiSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
