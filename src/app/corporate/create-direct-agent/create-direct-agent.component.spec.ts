import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDirectAgentComponent } from './create-direct-agent.component';

describe('CreateDirectAgentComponent', () => {
  let component: CreateDirectAgentComponent;
  let fixture: ComponentFixture<CreateDirectAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDirectAgentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateDirectAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
