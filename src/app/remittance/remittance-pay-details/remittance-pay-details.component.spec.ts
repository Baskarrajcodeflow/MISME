import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemittancePayDetailsComponent } from './remittance-pay-details.component';

describe('RemittancePayDetailsComponent', () => {
  let component: RemittancePayDetailsComponent;
  let fixture: ComponentFixture<RemittancePayDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemittancePayDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RemittancePayDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
