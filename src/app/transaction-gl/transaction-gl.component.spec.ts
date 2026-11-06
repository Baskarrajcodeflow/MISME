import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionGlComponent } from './transaction-gl.component';

describe('TransactionGlComponent', () => {
  let component: TransactionGlComponent;
  let fixture: ComponentFixture<TransactionGlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionGlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionGlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
