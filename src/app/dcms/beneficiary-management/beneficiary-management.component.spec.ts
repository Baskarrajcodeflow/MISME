import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryManagementComponent } from './beneficiary-management.component';

describe('BeneficiaryManagementComponent', () => {
  let component: BeneficiaryManagementComponent;
  let fixture: ComponentFixture<BeneficiaryManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeneficiaryManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BeneficiaryManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
