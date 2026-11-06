import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionManagementCardComponent } from './transaction-management-card.component';

describe('TransactionManagementCardComponent', () => {
  let component: TransactionManagementCardComponent;
  let fixture: ComponentFixture<TransactionManagementCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionManagementCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionManagementCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
