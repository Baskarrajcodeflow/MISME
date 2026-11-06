import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvValidationReportComponent } from './csv-validation-report.component';

describe('CsvValidationReportComponent', () => {
  let component: CsvValidationReportComponent;
  let fixture: ComponentFixture<CsvValidationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CsvValidationReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsvValidationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
