import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTransactionAndGlComponent } from './create-transaction-and-gl.component';

describe('CreateTransactionAndGlComponent', () => {
  let component: CreateTransactionAndGlComponent;
  let fixture: ComponentFixture<CreateTransactionAndGlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTransactionAndGlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateTransactionAndGlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
