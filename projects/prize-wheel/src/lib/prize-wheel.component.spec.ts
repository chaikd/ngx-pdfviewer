import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrizeWheelComponent } from './prize-wheel.component';

describe('PrizeWheelComponent', () => {
  let component: PrizeWheelComponent;
  let fixture: ComponentFixture<PrizeWheelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrizeWheelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrizeWheelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
