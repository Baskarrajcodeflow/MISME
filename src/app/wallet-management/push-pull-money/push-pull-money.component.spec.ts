import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PushPullMoneyComponent } from './push-pull-money.component';

describe('PushPullMoneyComponent', () => {
  let component: PushPullMoneyComponent;
  let fixture: ComponentFixture<PushPullMoneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PushPullMoneyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PushPullMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
