import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRiskTierComponent } from './list-risk-tier.component';

describe('ListRiskTierComponent', () => {
  let component: ListRiskTierComponent;
  let fixture: ComponentFixture<ListRiskTierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListRiskTierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListRiskTierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
