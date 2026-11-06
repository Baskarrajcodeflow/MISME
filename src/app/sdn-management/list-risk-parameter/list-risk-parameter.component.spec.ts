import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRiskParameterComponent } from './list-risk-parameter.component';

describe('ListRiskParameterComponent', () => {
  let component: ListRiskParameterComponent;
  let fixture: ComponentFixture<ListRiskParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListRiskParameterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListRiskParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
