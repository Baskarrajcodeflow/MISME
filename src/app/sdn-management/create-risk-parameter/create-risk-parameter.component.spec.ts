import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRiskParameterComponent } from './create-risk-parameter.component';

describe('CreateRiskParameterComponent', () => {
  let component: CreateRiskParameterComponent;
  let fixture: ComponentFixture<CreateRiskParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRiskParameterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRiskParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
