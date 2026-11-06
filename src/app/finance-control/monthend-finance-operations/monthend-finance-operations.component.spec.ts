import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthendFinanceOperationsComponent } from './monthend-finance-operations.component';

describe('MonthendFinanceOperationsComponent', () => {
  let component: MonthendFinanceOperationsComponent;
  let fixture: ComponentFixture<MonthendFinanceOperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthendFinanceOperationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonthendFinanceOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
