import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBasicAgentComponent } from './view-basic-agent.component';

describe('ViewBasicAgentComponent', () => {
  let component: ViewBasicAgentComponent;
  let fixture: ComponentFixture<ViewBasicAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewBasicAgentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewBasicAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
