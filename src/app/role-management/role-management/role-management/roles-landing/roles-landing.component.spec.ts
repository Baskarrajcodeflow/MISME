import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesLandingComponent } from './roles-landing.component';

describe('RolesLandingComponent', () => {
  let component: RolesLandingComponent;
  let fixture: ComponentFixture<RolesLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesLandingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RolesLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
