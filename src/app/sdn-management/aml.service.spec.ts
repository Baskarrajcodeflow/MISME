import { TestBed } from '@angular/core/testing';

import { AmlService } from './aml.service';

describe('AmlService', () => {
  let service: AmlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
