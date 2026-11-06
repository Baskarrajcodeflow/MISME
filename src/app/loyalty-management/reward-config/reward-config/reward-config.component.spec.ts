import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardConfigComponent } from './reward-config.component';

describe('RewardConfigComponent', () => {
  let component: RewardConfigComponent;
  let fixture: ComponentFixture<RewardConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RewardConfigComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RewardConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
