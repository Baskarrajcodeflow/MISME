import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectiveReversalMailComponent } from './selective-reversal-mail.component';

describe('SelectiveReversalMailComponent', () => {
  let component: SelectiveReversalMailComponent;
  let fixture: ComponentFixture<SelectiveReversalMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectiveReversalMailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectiveReversalMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
