import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDirectAgentComponent } from './list-direct-agent.component';

describe('ListDirectAgentComponent', () => {
  let component: ListDirectAgentComponent;
  let fixture: ComponentFixture<ListDirectAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListDirectAgentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListDirectAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
