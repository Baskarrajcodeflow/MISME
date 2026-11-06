import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessReportsComponent } from './business-reports.component';

describe('BusinessReportsComponent', () => {
  let component: BusinessReportsComponent;
  let fixture: ComponentFixture<BusinessReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BusinessReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
