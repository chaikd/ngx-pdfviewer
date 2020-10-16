import { TestBed } from '@angular/core/testing';

import { PrizeWheelService } from './prize-wheel.service';

describe('PrizeWheelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrizeWheelService = TestBed.get(PrizeWheelService);
    expect(service).toBeTruthy();
  });
});
