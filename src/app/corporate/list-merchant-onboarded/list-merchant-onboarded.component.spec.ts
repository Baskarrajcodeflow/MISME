import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMerchantOnboardedComponent } from './list-merchant-onboarded.component';

describe('ListMerchantOnboardedComponent', () => {
  let component: ListMerchantOnboardedComponent;
  let fixture: ComponentFixture<ListMerchantOnboardedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListMerchantOnboardedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListMerchantOnboardedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
