import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartOfAccBasicPageComponent } from './chart-of-acc-basic-page.component';

describe('ChartOfAccBasicPageComponent', () => {
  let component: ChartOfAccBasicPageComponent;
  let fixture: ComponentFixture<ChartOfAccBasicPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartOfAccBasicPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChartOfAccBasicPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
