import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessRefundComponent } from './process-refund.component';

describe('ProcessRefundComponent', () => {
  let component: ProcessRefundComponent;
  let fixture: ComponentFixture<ProcessRefundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessRefundComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProcessRefundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
