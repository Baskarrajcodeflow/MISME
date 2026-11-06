import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAgentKycComponent } from './view-agent-kyc.component';

describe('ViewAgentKycComponent', () => {
  let component: ViewAgentKycComponent;
  let fixture: ComponentFixture<ViewAgentKycComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAgentKycComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewAgentKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
