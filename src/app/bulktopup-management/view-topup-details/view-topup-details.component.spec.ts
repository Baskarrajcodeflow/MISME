import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTopupDetailsComponent } from './view-topup-details.component';

describe('ViewTopupDetailsComponent', () => {
  let component: ViewTopupDetailsComponent;
  let fixture: ComponentFixture<ViewTopupDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTopupDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewTopupDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
