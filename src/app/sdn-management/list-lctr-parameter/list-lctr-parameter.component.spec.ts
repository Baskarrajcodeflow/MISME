import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLctrParameterComponent } from './list-lctr-parameter.component';

describe('ListLctrParameterComponent', () => {
  let component: ListLctrParameterComponent;
  let fixture: ComponentFixture<ListLctrParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListLctrParameterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListLctrParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
