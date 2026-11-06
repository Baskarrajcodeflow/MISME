import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearendFinanceOperationsComponent } from './yearend-finance-operations.component';

describe('YearendFinanceOperationsComponent', () => {
  let component: YearendFinanceOperationsComponent;
  let fixture: ComponentFixture<YearendFinanceOperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearendFinanceOperationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(YearendFinanceOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
