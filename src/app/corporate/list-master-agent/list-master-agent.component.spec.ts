import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMasterAgentComponent } from './list-master-agent.component';

describe('ListMasterAgentComponent', () => {
  let component: ListMasterAgentComponent;
  let fixture: ComponentFixture<ListMasterAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListMasterAgentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListMasterAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
