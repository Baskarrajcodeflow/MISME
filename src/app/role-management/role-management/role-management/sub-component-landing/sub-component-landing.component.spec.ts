import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubComponentLandingComponent } from './sub-component-landing.component';

describe('SubComponentLandingComponent', () => {
  let component: SubComponentLandingComponent;
  let fixture: ComponentFixture<SubComponentLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubComponentLandingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubComponentLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
