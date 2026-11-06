import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralConfigComponent } from './referral-config.component';

describe('ReferralConfigComponent', () => {
  let component: ReferralConfigComponent;
  let fixture: ComponentFixture<ReferralConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferralConfigComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReferralConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
