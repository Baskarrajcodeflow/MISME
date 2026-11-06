import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMerchantOnboardingComponent } from './create-merchant-onboarding.component';

describe('CreateMerchantOnboardingComponent', () => {
  let component: CreateMerchantOnboardingComponent;
  let fixture: ComponentFixture<CreateMerchantOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMerchantOnboardingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateMerchantOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
