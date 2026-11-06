import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationManagementCardComponent } from './integration-management-card.component';

describe('IntegrationManagementCardComponent', () => {
  let component: IntegrationManagementCardComponent;
  let fixture: ComponentFixture<IntegrationManagementCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntegrationManagementCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IntegrationManagementCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
