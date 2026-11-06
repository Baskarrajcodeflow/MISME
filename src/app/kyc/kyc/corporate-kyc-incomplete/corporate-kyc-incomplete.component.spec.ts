import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateKycIncompleteComponent } from './corporate-kyc-incomplete.component';

describe('CorporateKycIncompleteComponent', () => {
  let component: CorporateKycIncompleteComponent;
  let fixture: ComponentFixture<CorporateKycIncompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorporateKycIncompleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CorporateKycIncompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
