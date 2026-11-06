import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentKycComponent } from './agent-kyc.component';

describe('AgentKycComponent', () => {
  let component: AgentKycComponent;
  let fixture: ComponentFixture<AgentKycComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentKycComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgentKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
