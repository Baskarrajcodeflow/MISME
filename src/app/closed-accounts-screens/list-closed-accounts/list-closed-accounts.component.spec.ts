import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListClosedAccountsComponent } from './list-closed-accounts.component';

describe('ListClosedAccountsComponent', () => {
  let component: ListClosedAccountsComponent;
  let fixture: ComponentFixture<ListClosedAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListClosedAccountsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListClosedAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
