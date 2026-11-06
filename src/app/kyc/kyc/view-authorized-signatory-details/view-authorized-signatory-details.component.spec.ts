import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAuthorizedSignatoryDetailsComponent } from './view-authorized-signatory-details.component';

describe('ViewAuthorizedSignatoryDetailsComponent', () => {
  let component: ViewAuthorizedSignatoryDetailsComponent;
  let fixture: ComponentFixture<ViewAuthorizedSignatoryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAuthorizedSignatoryDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewAuthorizedSignatoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
