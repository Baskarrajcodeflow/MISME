import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountManagementCardComponent } from './account-management-card.component';

describe('AccountManagementCardComponent', () => {
  let component: AccountManagementCardComponent;
  let fixture: ComponentFixture<AccountManagementCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountManagementCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountManagementCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
