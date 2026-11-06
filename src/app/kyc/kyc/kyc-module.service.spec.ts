import { TestBed } from '@angular/core/testing';

import { KycModuleService } from './kyc-module.service';

describe('KycModuleService', () => {
  let service: KycModuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KycModuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
