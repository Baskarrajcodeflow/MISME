import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceControlComponent } from './finance-control.component';

describe('FinanceControlComponent', () => {
  let component: FinanceControlComponent;
  let fixture: ComponentFixture<FinanceControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceControlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinanceControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
