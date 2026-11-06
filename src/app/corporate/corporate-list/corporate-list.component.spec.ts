import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateListComponent } from './corporate-list.component';

describe('CorporateListComponent', () => {
  let component: CorporateListComponent;
  let fixture: ComponentFixture<CorporateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorporateListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CorporateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
