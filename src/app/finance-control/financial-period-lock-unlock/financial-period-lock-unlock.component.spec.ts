import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPeriodLockUnlockComponent } from './financial-period-lock-unlock.component';

describe('FinancialPeriodLockUnlockComponent', () => {
  let component: FinancialPeriodLockUnlockComponent;
  let fixture: ComponentFixture<FinancialPeriodLockUnlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialPeriodLockUnlockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinancialPeriodLockUnlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
