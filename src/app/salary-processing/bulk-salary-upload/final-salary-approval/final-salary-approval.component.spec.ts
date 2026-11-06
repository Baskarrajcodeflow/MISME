import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalSalaryApprovalComponent } from './final-salary-approval.component';

describe('FinalSalaryApprovalComponent', () => {
  let component: FinalSalaryApprovalComponent;
  let fixture: ComponentFixture<FinalSalaryApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalSalaryApprovalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinalSalaryApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
