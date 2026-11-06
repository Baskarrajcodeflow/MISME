import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBasicCustomerComponent } from './view-basic-customer.component';

describe('ViewBasicCustomerComponent', () => {
  let component: ViewBasicCustomerComponent;
  let fixture: ComponentFixture<ViewBasicCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewBasicCustomerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewBasicCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
