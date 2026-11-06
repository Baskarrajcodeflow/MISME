import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionLandingComponent } from './permission-landing.component';

describe('PermissionLandingComponent', () => {
  let component: PermissionLandingComponent;
  let fixture: ComponentFixture<PermissionLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionLandingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PermissionLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
