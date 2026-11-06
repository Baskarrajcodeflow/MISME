import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentJournalVoucherComponent } from './payment-journal-voucher.component';

describe('PaymentJournalVoucherComponent', () => {
  let component: PaymentJournalVoucherComponent;
  let fixture: ComponentFixture<PaymentJournalVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentJournalVoucherComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentJournalVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
