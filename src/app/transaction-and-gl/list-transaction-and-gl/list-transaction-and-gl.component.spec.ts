import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTransactionAndGlComponent } from './list-transaction-and-gl.component';

describe('ListTransactionAndGlComponent', () => {
  let component: ListTransactionAndGlComponent;
  let fixture: ComponentFixture<ListTransactionAndGlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListTransactionAndGlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListTransactionAndGlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
