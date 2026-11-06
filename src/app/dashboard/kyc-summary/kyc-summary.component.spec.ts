import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycSummaryComponent } from './kyc-summary.component';

describe('KycSummaryComponent', () => {
  let component: KycSummaryComponent;
  let fixture: ComponentFixture<KycSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KycSummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KycSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
