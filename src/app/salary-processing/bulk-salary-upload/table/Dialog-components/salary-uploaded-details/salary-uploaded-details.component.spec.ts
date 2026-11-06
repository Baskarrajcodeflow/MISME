import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryUploadedDetailsComponent } from './salary-uploaded-details.component';

describe('SalaryUploadedDetailsComponent', () => {
  let component: SalaryUploadedDetailsComponent;
  let fixture: ComponentFixture<SalaryUploadedDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryUploadedDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalaryUploadedDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
