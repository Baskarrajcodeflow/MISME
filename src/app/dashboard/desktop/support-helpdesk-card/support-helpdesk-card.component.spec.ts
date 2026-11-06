import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportHelpdeskCardComponent } from './support-helpdesk-card.component';

describe('SupportHelpdeskCardComponent', () => {
  let component: SupportHelpdeskCardComponent;
  let fixture: ComponentFixture<SupportHelpdeskCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportHelpdeskCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupportHelpdeskCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
