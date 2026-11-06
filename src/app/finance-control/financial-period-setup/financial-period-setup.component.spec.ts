import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPeriodSetupComponent } from './financial-period-setup.component';

describe('FinancialPeriodSetupComponent', () => {
  let component: FinancialPeriodSetupComponent;
  let fixture: ComponentFixture<FinancialPeriodSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialPeriodSetupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinancialPeriodSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
