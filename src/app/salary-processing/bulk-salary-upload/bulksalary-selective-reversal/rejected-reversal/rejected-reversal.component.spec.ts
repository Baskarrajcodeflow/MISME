import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedReversalComponent } from './rejected-reversal.component';

describe('RejectedReversalComponent', () => {
  let component: RejectedReversalComponent;
  let fixture: ComponentFixture<RejectedReversalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectedReversalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RejectedReversalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
