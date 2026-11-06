import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFundingPartyComponent } from './list-funding-party.component';

describe('ListFundingPartyComponent', () => {
  let component: ListFundingPartyComponent;
  let fixture: ComponentFixture<ListFundingPartyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListFundingPartyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListFundingPartyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
