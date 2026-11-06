import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LowBalanceListComponent } from './low-balance-list.component';

describe('LowBalanceListComponent', () => {
  let component: LowBalanceListComponent;
  let fixture: ComponentFixture<LowBalanceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LowBalanceListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LowBalanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
