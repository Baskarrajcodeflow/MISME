import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsAlertsCardComponent } from './notifications-alerts-card.component';

describe('NotificationsAlertsCardComponent', () => {
  let component: NotificationsAlertsCardComponent;
  let fixture: ComponentFixture<NotificationsAlertsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationsAlertsCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotificationsAlertsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
