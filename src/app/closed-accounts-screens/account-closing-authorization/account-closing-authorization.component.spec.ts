import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountClosingAuthorizationComponent } from './account-closing-authorization.component';

describe('AccountClosingAuthorizationComponent', () => {
  let component: AccountClosingAuthorizationComponent;
  let fixture: ComponentFixture<AccountClosingAuthorizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountClosingAuthorizationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountClosingAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
