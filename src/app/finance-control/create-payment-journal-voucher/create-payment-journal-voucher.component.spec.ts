import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePaymentJournalVoucherComponent } from './create-payment-journal-voucher.component';

describe('CreatePaymentJournalVoucherComponent', () => {
  let component: CreatePaymentJournalVoucherComponent;
  let fixture: ComponentFixture<CreatePaymentJournalVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePaymentJournalVoucherComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreatePaymentJournalVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
