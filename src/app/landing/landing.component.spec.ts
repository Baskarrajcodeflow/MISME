import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingComponent } from './landing.component';
import { contextSwitch } from '../interface/interface-list';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let context = contextSwitch
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
