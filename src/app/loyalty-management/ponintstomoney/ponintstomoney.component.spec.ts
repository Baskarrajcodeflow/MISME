import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PonintstomoneyComponent } from './ponintstomoney.component';

describe('PonintstomoneyComponent', () => {
  let component: PonintstomoneyComponent;
  let fixture: ComponentFixture<PonintstomoneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PonintstomoneyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PonintstomoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
