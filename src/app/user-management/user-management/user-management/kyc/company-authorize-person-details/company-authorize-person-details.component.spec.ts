import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAuthorizePersonDetailsComponent } from './company-authorize-person-details.component';

describe('CompanyAuthorizePersonDetailsComponent', () => {
  let component: CompanyAuthorizePersonDetailsComponent;
  let fixture: ComponentFixture<CompanyAuthorizePersonDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyAuthorizePersonDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompanyAuthorizePersonDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
