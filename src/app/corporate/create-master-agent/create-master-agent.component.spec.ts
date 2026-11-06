import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMasterAgentComponent } from './create-master-agent.component';

describe('CreateMasterAgentComponent', () => {
  let component: CreateMasterAgentComponent;
  let fixture: ComponentFixture<CreateMasterAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMasterAgentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateMasterAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
