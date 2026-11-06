import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGovtKycComponent } from './view-govt-kyc.component';

describe('ViewGovtKycComponent', () => {
  let component: ViewGovtKycComponent;
  let fixture: ComponentFixture<ViewGovtKycComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewGovtKycComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewGovtKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
