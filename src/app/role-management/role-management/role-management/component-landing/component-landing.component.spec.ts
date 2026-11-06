import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentLandingComponent } from './component-landing.component';

describe('ComponentLandingComponent', () => {
  let component: ComponentLandingComponent;
  let fixture: ComponentFixture<ComponentLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentLandingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComponentLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
