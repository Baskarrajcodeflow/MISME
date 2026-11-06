import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingBulksalaryReversalComponent } from './pending-bulksalary-reversal.component';

describe('PendingBulksalaryReversalComponent', () => {
  let component: PendingBulksalaryReversalComponent;
  let fixture: ComponentFixture<PendingBulksalaryReversalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingBulksalaryReversalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PendingBulksalaryReversalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
