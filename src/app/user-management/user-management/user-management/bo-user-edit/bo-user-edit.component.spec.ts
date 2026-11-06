import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoUserEditComponent } from './bo-user-edit.component';

describe('BoUserEditComponent', () => {
  let component: BoUserEditComponent;
  let fixture: ComponentFixture<BoUserEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoUserEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoUserEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
