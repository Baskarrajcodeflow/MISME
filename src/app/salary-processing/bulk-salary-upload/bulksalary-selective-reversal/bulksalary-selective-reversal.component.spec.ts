import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulksalarySelectiveReversalComponent } from './bulksalary-selective-reversal.component';

describe('BulksalarySelectiveReversalComponent', () => {
  let component: BulksalarySelectiveReversalComponent;
  let fixture: ComponentFixture<BulksalarySelectiveReversalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulksalarySelectiveReversalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BulksalarySelectiveReversalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
