import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncompleteKycComponent } from './incomplete-kyc.component';

describe('IncompleteKycComponent', () => {
  let component: IncompleteKycComponent;
  let fixture: ComponentFixture<IncompleteKycComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncompleteKycComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IncompleteKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
