import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualNotificationComponent } from './manual-notification.component';

describe('ManualNotificationComponent', () => {
  let component: ManualNotificationComponent;
  let fixture: ComponentFixture<ManualNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManualNotificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManualNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
