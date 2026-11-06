import { TestBed } from '@angular/core/testing';

import { GlService } from './gl.service';

describe('GlService', () => {
  let service: GlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
