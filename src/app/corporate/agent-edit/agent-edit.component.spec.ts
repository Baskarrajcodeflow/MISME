import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentEditComponent } from './agent-edit.component';

describe('AgentEditComponent', () => {
  let component: AgentEditComponent;
  let fixture: ComponentFixture<AgentEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
