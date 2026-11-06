import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAgentViewComponent } from './sub-agent-view.component';

describe('SubAgentViewComponent', () => {
  let component: SubAgentViewComponent;
  let fixture: ComponentFixture<SubAgentViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubAgentViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubAgentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
