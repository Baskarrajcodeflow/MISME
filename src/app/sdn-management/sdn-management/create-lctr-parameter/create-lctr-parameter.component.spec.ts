import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLctrParameterComponent } from './create-lctr-parameter.component';

describe('CreateLctrParameterComponent', () => {
  let component: CreateLctrParameterComponent;
  let fixture: ComponentFixture<CreateLctrParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateLctrParameterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateLctrParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
