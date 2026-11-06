import { TestBed } from '@angular/core/testing';

import { LowBalanceService } from './low-balance.service';

describe('LowBalanceService', () => {
  let service: LowBalanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LowBalanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
