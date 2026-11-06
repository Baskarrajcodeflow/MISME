import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMasteragentKycComponent } from './view-masteragent-kyc.component';

describe('ViewMasteragentKycComponent', () => {
  let component: ViewMasteragentKycComponent;
  let fixture: ComponentFixture<ViewMasteragentKycComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMasteragentKycComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewMasteragentKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
