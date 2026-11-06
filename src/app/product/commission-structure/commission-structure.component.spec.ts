import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionStructureComponent } from './commission-structure.component';

describe('CommissionStructureComponent', () => {
  let component: CommissionStructureComponent;
  let fixture: ComponentFixture<CommissionStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommissionStructureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommissionStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
