import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralBonusCongigComponent } from './referral-bonus-congig.component';

describe('ReferralBonusCongigComponent', () => {
  let component: ReferralBonusCongigComponent;
  let fixture: ComponentFixture<ReferralBonusCongigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferralBonusCongigComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReferralBonusCongigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
