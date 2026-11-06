import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateRegistartionComponent } from './corporate-registartion.component';

describe('CorporateRegistartionComponent', () => {
  let component: CorporateRegistartionComponent;
  let fixture: ComponentFixture<CorporateRegistartionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorporateRegistartionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CorporateRegistartionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
