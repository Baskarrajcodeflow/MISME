import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDetailsBulkSalaryComponent } from './view-details-bulk-salary.component';

describe('ViewDetailsBulkSalaryComponent', () => {
  let component: ViewDetailsBulkSalaryComponent;
  let fixture: ComponentFixture<ViewDetailsBulkSalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDetailsBulkSalaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewDetailsBulkSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
