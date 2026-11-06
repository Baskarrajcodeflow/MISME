import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSuperagentKycComponent } from './view-superagent-kyc.component';

describe('ViewSuperagentKycComponent', () => {
  let component: ViewSuperagentKycComponent;
  let fixture: ComponentFixture<ViewSuperagentKycComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSuperagentKycComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewSuperagentKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
