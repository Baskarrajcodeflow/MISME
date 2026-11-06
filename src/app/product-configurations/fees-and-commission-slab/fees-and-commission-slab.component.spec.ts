import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesAndCommissionSlabComponent } from './fees-and-commission-slab.component';

describe('FeesAndCommissionSlabComponent', () => {
  let component: FeesAndCommissionSlabComponent;
  let fixture: ComponentFixture<FeesAndCommissionSlabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeesAndCommissionSlabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FeesAndCommissionSlabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
