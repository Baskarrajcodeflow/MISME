import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingAnalyticsCardComponent } from './reporting-analytics-card.component';

describe('ReportingAnalyticsCardComponent', () => {
  let component: ReportingAnalyticsCardComponent;
  let fixture: ComponentFixture<ReportingAnalyticsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportingAnalyticsCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportingAnalyticsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
