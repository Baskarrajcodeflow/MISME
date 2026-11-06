import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubComponentComponent } from './add-sub-component.component';

describe('AddSubComponentComponent', () => {
  let component: AddSubComponentComponent;
  let fixture: ComponentFixture<AddSubComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSubComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSubComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
