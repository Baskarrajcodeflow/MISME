import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCustomerKycComponent } from './view-customer-kyc.component';

describe('ViewCustomerKycComponent', () => {
  let component: ViewCustomerKycComponent;
  let fixture: ComponentFixture<ViewCustomerKycComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCustomerKycComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewCustomerKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
