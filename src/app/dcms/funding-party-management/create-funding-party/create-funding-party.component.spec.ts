import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFundingPartyComponent } from './create-funding-party.component';

describe('CreateFundingPartyComponent', () => {
  let component: CreateFundingPartyComponent;
  let fixture: ComponentFixture<CreateFundingPartyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateFundingPartyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateFundingPartyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
