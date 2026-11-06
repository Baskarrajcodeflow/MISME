import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateFormComponent } from './corporate-form.component';

describe('CorporateFormComponent', () => {
  let component: CorporateFormComponent;
  let fixture: ComponentFixture<CorporateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorporateFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CorporateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
