import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionStatusCardComponent } from './transaction-status-card.component';

describe('TransactionStatusCardComponent', () => {
  let component: TransactionStatusCardComponent;
  let fixture: ComponentFixture<TransactionStatusCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionStatusCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionStatusCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
