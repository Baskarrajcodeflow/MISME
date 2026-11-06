import { TestBed } from '@angular/core/testing';

import { DcmsService } from './dcms.service';

describe('DcmsService', () => {
  let service: DcmsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DcmsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
