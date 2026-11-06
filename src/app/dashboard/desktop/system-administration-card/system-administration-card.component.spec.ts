import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemAdministrationCardComponent } from './system-administration-card.component';

describe('SystemAdministrationCardComponent', () => {
  let component: SystemAdministrationCardComponent;
  let fixture: ComponentFixture<SystemAdministrationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemAdministrationCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SystemAdministrationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
