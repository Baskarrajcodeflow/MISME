import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralStatusReportComponent } from './general-status-report.component';

describe('GeneralStatusReportComponent', () => {
  let component: GeneralStatusReportComponent;
  let fixture: ComponentFixture<GeneralStatusReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralStatusReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GeneralStatusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
