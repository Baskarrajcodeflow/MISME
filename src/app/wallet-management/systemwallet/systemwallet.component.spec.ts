import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemwalletComponent } from './systemwallet.component';

describe('SystemwalletComponent', () => {
  let component: SystemwalletComponent;
  let fixture: ComponentFixture<SystemwalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemwalletComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SystemwalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
