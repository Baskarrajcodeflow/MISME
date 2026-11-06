import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceSecurityCardComponent } from './compliance-security-card.component';

describe('ComplianceSecurityCardComponent', () => {
  let component: ComplianceSecurityCardComponent;
  let fixture: ComponentFixture<ComplianceSecurityCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplianceSecurityCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComplianceSecurityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
