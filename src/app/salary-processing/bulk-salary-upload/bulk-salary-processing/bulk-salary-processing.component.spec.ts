import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkSalaryProcessingComponent } from './bulk-salary-processing.component';

describe('BulkSalaryProcessingComponent', () => {
  let component: BulkSalaryProcessingComponent;
  let fixture: ComponentFixture<BulkSalaryProcessingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkSalaryProcessingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BulkSalaryProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
