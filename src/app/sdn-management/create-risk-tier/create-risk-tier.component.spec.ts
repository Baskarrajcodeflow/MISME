import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRiskTierComponent } from './create-risk-tier.component';

describe('CreateRiskTierComponent', () => {
  let component: CreateRiskTierComponent;
  let fixture: ComponentFixture<CreateRiskTierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRiskTierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRiskTierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
